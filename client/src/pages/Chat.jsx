import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom'; 
import axios from 'axios';
import { supabase } from '../supabase';
import { Send, User, Loader2 } from 'lucide-react';

const Chat = () => {
  const { roomId, landlordId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef(null);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchMessages = async (myId) => {
      try {
          const res = await axios.get(`${apiUrl}/api/chat/${roomId}/${landlordId}/${myId}`);
          setMessages(res.data);
          setLoading(false);
      } catch (err) {
          console.error(err);
      }
  };

  useEffect(() => {
    const initChat = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      
      if (user && roomId && landlordId) {
          fetchMessages(user.id);
          
          const channel = supabase
            .channel('public:messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
                if (payload.new.room_id === roomId) {
                    setMessages((prev) => [...prev, payload.new]);
                }
            })
            .subscribe();

          return () => supabase.removeChannel(channel);
      }
      setLoading(false);
    };
    initChat();
  }, [roomId, landlordId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e) => {
      e.preventDefault();
      if (!newMessage.trim()) return;

      try {
          await axios.post(`${apiUrl}/api/chat`, {
              sender_id: currentUser.id,
              receiver_id: landlordId,
              room_id: roomId,
              content: newMessage
          });
          setNewMessage('');
          fetchMessages(currentUser.id); 
      } catch (err) {
          console.error("Failed to send", err);
      }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-blue-500" size={48} />
            <p className="text-gray-400 font-medium">Loading conversation...</p>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 p-4 border-b border-gray-700 flex items-center gap-4 shadow-md sticky top-0 z-10">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                <User className="text-white" />
            </div>
            <div>
                <h2 className="font-bold">Landlord Chat</h2>
                <p className="text-xs text-green-400">Online</p>
            </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/50">
            {messages.map((msg) => {
                const isMe = msg.sender_id === currentUser?.id; 
                return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-3 rounded-2xl ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                            <p>{msg.content}</p>
                            <span className="text-[10px] opacity-70 block text-right mt-1">
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                );
            })}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-gray-800 border-t border-gray-700">
            <form onSubmit={handleSend} className="flex gap-2 max-w-4xl mx-auto">
                <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-900 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl transition-colors">
                    <Send size={20} />
                </button>
            </form>
        </div>
    </div>
  );
};

export default Chat;