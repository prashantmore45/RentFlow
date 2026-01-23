import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { Send, Inbox, Home, Trash2, Edit, MessageCircle, MessageSquare } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  
  const [sentApps, setSentApps] = useState([]);
  const [receivedApps, setReceivedApps] = useState([]);
  const [myRooms, setMyRooms] = useState([]); 
  const [inboxChats, setInboxChats] = useState([]);

  const [activeTab, setActiveTab] = useState('sent');

  const processInbox = (allMessages, myId) => {
      const conversations = {};
      allMessages.forEach(msg => {
          const isSender = msg.sender_id === myId;
          const partner = isSender ? msg.receiver : msg.sender;
          
          if (msg.rooms && partner) {
              const key = `${msg.room_id}-${partner.id}`;
              if (!conversations[key]) {
                  conversations[key] = {
                      message: msg,
                      partner: partner,
                      room: msg.rooms
                  };
              }
          }
      });
      return Object.values(conversations);
  };

  const fetchInbox = async (userId) => {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      try {
          const chatRes = await axios.get(`${apiUrl}/api/chat/my-chats/${userId}`);
          const processed = processInbox(chatRes.data, userId);
          setInboxChats(processed);
      } catch (err) {
          console.error("Error updating inbox", err);
      }
  };

  const loadDashboardData = async (userId) => {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      try {
        const sentRes = await axios.get(`${apiUrl}/api/applications/tenant/${userId}`);
        setSentApps(sentRes.data);

        const receivedRes = await axios.get(`${apiUrl}/api/applications/landlord/${userId}`);
        setReceivedApps(receivedRes.data);

        const roomsRes = await axios.get(`${apiUrl}/api/rooms/my-rooms/${userId}`);
        setMyRooms(roomsRes.data);

        await fetchInbox(userId); 
      } catch (err) {
        console.error("Error loading dashboard", err);
      }
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await loadDashboardData(user.id);

      const channel = supabase
        .channel('dashboard-messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
             if (payload.new.sender_id === user.id || payload.new.receiver_id === user.id) {
                 fetchInbox(user.id);
             }
        })
        .subscribe();

      return () => supabase.removeChannel(channel);
    };
    fetchData();
  }, []);


  const handleDeleteRoom = async (roomId) => {
    if (!confirm("Are you sure?")) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.delete(`${apiUrl}/api/rooms/${roomId}`);
      setMyRooms(prev => prev.filter(room => room.id !== roomId));
      alert("Deleted.");
    } catch (error) { 
      console.error("Failed to delete room:", error);
      alert("Failed to delete room. Please try again or contact support.");
    }
  };

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.patch(`${apiUrl}/api/applications/${appId}`, { status: newStatus });
      setReceivedApps(prev => prev.map(app => app.id === appId ? { ...app, status: newStatus } : app));
    } catch (error) { 
      console.error("Failed to update application status:", error);
      alert("Failed to update application status. Please try again."); 
    }
  };

  const getStatusColor = (status) => {
    if (status === 'accepted') return 'bg-green-500/10 text-green-500 border-green-500/20';
    if (status === 'rejected') return 'bg-red-500/10 text-red-500 border-red-500/20';
    return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>

        <div className="flex gap-4 mb-8 border-b border-gray-700 pb-1 overflow-x-auto no-scrollbar">
          <button onClick={() => setActiveTab('sent')} className={`pb-3 px-4 flex items-center gap-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'sent' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}>
            <Send size={18} /> Sent Apps ({sentApps.length})
          </button>
          <button onClick={() => setActiveTab('received')} className={`pb-3 px-4 flex items-center gap-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'received' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400'}`}>
            <Inbox size={18} /> Received Apps ({receivedApps.length})
          </button>
          <button onClick={() => setActiveTab('listings')} className={`pb-3 px-4 flex items-center gap-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'listings' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400'}`}>
            <Home size={18} /> My Listings ({myRooms.length})
          </button>
          <button onClick={() => setActiveTab('inbox')} className={`pb-3 px-4 flex items-center gap-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'inbox' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400'}`}>
            <MessageSquare size={18} /> Inbox ({inboxChats.length})
          </button>
        </div>

        {/* 1. SENT APPS */}
        {activeTab === 'sent' && (
          <div className="space-y-4">
            {sentApps.length === 0 ? (
              <p className="text-gray-500">No applications sent.</p>
            ) : sentApps.map(app => (
              <div
                key={app.id}
                className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden flex flex-col md:flex-row"
              >
                {/* LEFT: ROOM IMAGE */}
                <div className="w-full md:w-56 h-48 md:h-auto relative bg-gray-700 shrink-0">
                  <img
                    src={app.rooms?.image_url || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"}
                    alt={app.rooms?.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267";
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                    ₹{app.rooms?.price}/mo
                  </div>
                </div>

                {/* RIGHT */}
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold line-clamp-1">
                        {app.rooms?.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs border capitalize font-bold ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-400 mb-1">
                      Landlord:{' '}
                      <span className="text-blue-400 font-medium">
                        User…{app.owner_id.slice(0,4)}
                      </span>
                    </p>

                    <p className="text-sm text-gray-400 mb-3">
                      {app.rooms?.location}
                    </p>

                    <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
                      <p className="text-xs text-gray-500 mb-1">Your Message:</p>
                      <p className="text-gray-300 italic text-sm">
                        "{app.message}"
                      </p>
                    </div>
                  </div>

                  {/* CHAT ICON */}
                  <div className="flex justify-end mt-4">
                    <Link
                      to={`/chat/${app.room_id}/${app.owner_id}`}
                      className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 p-2 rounded-lg border border-blue-500/20"
                    >
                      <MessageCircle size={20} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. RECEIVED APPS */}
        {activeTab === 'received' && (
          <div className="space-y-4">
            {receivedApps.length === 0 ? <p className="text-gray-500">No applications received.</p> : receivedApps.map(app => (
              <div key={app.id} className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                 <div className="flex justify-between mb-4">
                    <h3 className="font-bold">Applicant: <span className="text-purple-400">{app.profiles?.full_name || 'User'}</span></h3>
                    <span className={`px-2 py-1 rounded text-xs border uppercase ${getStatusColor(app.status)}`}>{app.status}</span>
                 </div>
                 <p className="text-gray-400 text-sm mb-4">Property: {app.rooms?.title}</p>
                 <div className="flex gap-2">
                    {app.status === 'pending' && (
                       <>
                         <button onClick={() => handleStatusUpdate(app.id, 'accepted')} className="px-4 py-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20">Accept</button>
                         <button onClick={() => handleStatusUpdate(app.id, 'rejected')} className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20">Reject</button>
                       </>
                    )}
                    <Link to={`/chat/${app.room_id}/${app.applicant_id}`} className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 flex items-center gap-2"><MessageCircle size={18}/> Chat</Link>
                 </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. LISTINGS */}
        {activeTab === 'listings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myRooms.length === 0 ? (
              <p className="text-gray-500">You haven't posted any rooms yet.</p>
            ) : myRooms.map(room => (
              <div key={room.id} className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden group hover:border-green-500/50 transition-all">

                <div className="h-48 w-full relative bg-gray-700">
                  <img
                    src={room.image_url || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"}
                    alt={room.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267";
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                    ₹{room.price}/mo
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold truncate">{room.title}</h3>
                  <p className="text-sm text-gray-400 mb-4">{room.location}</p>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => navigate(`/edit-room/${room.id}`)}
                      className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <Edit size={16} /> Edit
                    </button>

                    <button
                      onClick={() => handleDeleteRoom(room.id)}
                      className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. INBOX (UPDATES IN REAL-TIME) */}
        {activeTab === 'inbox' && (
          <div className="space-y-4">
            {inboxChats.length === 0 ? <p className="text-gray-500">No active conversations.</p> : inboxChats.map((chat, idx) => (
              <Link 
                  key={idx} 
                  to={`/chat/${chat.room.id}/${chat.partner.id}`}
                  className="block bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-yellow-400/50 transition-colors group"
              >
                 <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center font-bold text-lg text-white shadow-lg">
                        {chat.partner.full_name ? chat.partner.full_name[0] : 'U'}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                            <h3 className="font-bold text-lg text-white group-hover:text-yellow-400 transition-colors">
                                {chat.partner.full_name || 'User'}
                            </h3>
                            <span className="text-xs text-gray-500">
                                {new Date(chat.message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        <p className="text-sm text-blue-400 mb-2 font-medium">{chat.room.title}</p>
                        <div className="bg-gray-900/50 p-3 rounded-xl border border-gray-700/50">
                            <p className="text-gray-400 text-sm truncate italic">
                                "{chat.message.content}"
                            </p>
                        </div>
                    </div>
                 </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;