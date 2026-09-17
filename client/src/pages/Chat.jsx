import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { supabase } from '../supabase';
import { Send, User, Loader2, ArrowLeft, Building2 } from 'lucide-react';

const Chat = () => {
  const { roomId, otherUserId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [partner, setPartner] = useState(null);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const initChat = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
          navigate('/login');
          return;
      }
      
      setCurrentUser(session.user);
      
      if (session.user && roomId && otherUserId) {
          try {
              // Fetch Chat Partner Details
              const { data: profile } = await supabase.from('profiles').select('full_name, role').eq('id', otherUserId).single();
              setPartner(profile || { full_name: 'Unknown User' });
              
              // Fetch Room Details
              const roomRes = await api.get(`/api/rooms/${roomId}`);
              setRoom(roomRes.data);

              // Fetch Messages
              const msgRes = await api.get(`/api/chat/${roomId}/${otherUserId}/${session.user.id}`);
              setMessages(msgRes.data);
          } catch (err) {
              console.error("Failed to init chat data", err);
          } finally {
              setLoading(false);
          }
          
          // Subscribe to new messages
          const channel = supabase
            .channel('public:messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
                if (payload.new.room_id === roomId && 
                   (payload.new.sender_id === otherUserId || payload.new.receiver_id === otherUserId)) {
                    setMessages((prev) => [...prev, payload.new]);
                }
            })
            .subscribe();

          return () => supabase.removeChannel(channel);
      }
    };
    initChat();
  }, [roomId, otherUserId, navigate]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e) => {
      e.preventDefault();
      if (!newMessage.trim()) return;
      
      const contentToSend = newMessage;
      setNewMessage(''); // Optimistic UI clear

      try {
          await api.post('/api/chat', {
              receiver_id: otherUserId,
              room_id: roomId,
              content: contentToSend
          });
          // Wait for socket to push it, or fetch again
          const msgRes = await api.get(`/api/chat/${roomId}/${otherUserId}/${currentUser.id}`);
          setMessages(msgRes.data);
      } catch (err) {
          console.error("Failed to send", err);
      }
  };

  if (loading) return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-900 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-blue-500" size={48} />
            <p className="text-gray-400 font-medium">Loading conversation...</p>
        </div>
    </div>
  );

  return (
    <div className="h-full w-full bg-gray-950 flex flex-col">
        {/* Chat Header */}
        <div className="bg-gray-900 border-b border-gray-800 p-4 shadow-sm z-10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-colors bg-gray-800 p-2 rounded-xl">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center font-bold text-lg text-white shadow-inner">
                        {partner?.full_name ? partner.full_name[0] : 'U'}
                    </div>
                    <div>
                        <h2 className="font-bold text-white leading-tight">{partner?.full_name || 'User'}</h2>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-gray-400">Online</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Room Context Banner */}
        {room && (
            <Link to={`/room/${room.id}`} className="bg-gray-800/80 backdrop-blur-md border-b border-gray-700 p-3 px-4 flex items-center gap-4 shrink-0 hover:bg-gray-800 transition-colors group cursor-pointer">
                <img src={room.image_url} alt="Room" className="w-12 h-12 rounded-lg object-cover bg-gray-700" onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"; }} />
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Discussing Property</p>
                    <h4 className="font-bold text-gray-200 text-sm truncate group-hover:text-blue-400 transition-colors">{room.title}</h4>
                </div>
                <div className="text-right shrink-0">
                    <p className="text-blue-400 font-bold text-sm">₹{room.price}</p>
                    <p className="text-xs text-gray-500">{room.property_type}</p>
                </div>
            </Link>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar scroll-smooth">
            {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <Building2 size={48} className="mb-4 opacity-20" />
                    <p className="font-medium text-gray-400">No messages yet.</p>
                    <p className="text-sm text-gray-500">Send a message to start the conversation!</p>
                </div>
            ) : (
                messages.map((msg, index) => {
                    const isMe = msg.sender_id === currentUser?.id; 
                    const showAvatar = index === 0 || messages[index-1].sender_id !== msg.sender_id;
                    
                    return (
                        <div key={msg.id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex max-w-[85%] md:max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'} gap-2 items-end`}>
                                {/* Avatar next to message (only for other user) */}
                                {!isMe && (
                                    <div className="w-8 h-8 shrink-0 flex flex-col justify-end">
                                        {showAvatar && (
                                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center font-bold text-xs text-white">
                                                {partner?.full_name ? partner.full_name[0] : 'U'}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className={`px-4 py-2.5 shadow-sm ${
                                    isMe 
                                      ? 'bg-blue-600 text-white rounded-2xl rounded-br-sm' 
                                      : 'bg-gray-800 border border-gray-700 text-gray-100 rounded-2xl rounded-bl-sm'
                                }`}>
                                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                    <span className={`text-[10px] block mt-1 ${isMe ? 'text-blue-200 text-right' : 'text-gray-500 text-left'}`}>
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
            <div ref={messagesEndRef} className="h-1" />
        </div>

        {/* Input Area */}
        <div className="bg-gray-900 border-t border-gray-800 p-4 shrink-0 pb-6 md:pb-4">
            <form onSubmit={handleSend} className="flex gap-2 max-w-4xl mx-auto relative">
                <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-full pl-5 pr-14 py-3 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
                />
                <button 
                    type="submit" 
                    disabled={!newMessage.trim()}
                    className="absolute right-1.5 top-1.5 bottom-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white aspect-square rounded-full flex items-center justify-center transition-colors"
                >
                    <Send size={16} className="ml-1" />
                </button>
            </form>
            <p className="text-center text-[10px] text-gray-500 mt-3 hidden md:block">Messages are securely encrypted. Do not share sensitive information like bank details.</p>
        </div>
        <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4b5563; }
        `}</style>
    </div>
  );
};

export default Chat;