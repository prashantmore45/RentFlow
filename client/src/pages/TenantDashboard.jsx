import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { Send, MessageSquare, Heart, FileText, ArrowRight, Sparkles, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const TenantDashboard = () => {
  const navigate = useNavigate();
  
  const [sentApps, setSentApps] = useState([]);
  const [inboxChats, setInboxChats] = useState([]);
  const [activeTab, setActiveTab] = useState('applications');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const processInbox = (allMessages, myId) => {
      const conversations = {};
      allMessages.forEach(msg => {
          const isSender = msg.sender_id === myId;
          const partnerId = isSender ? msg.receiver_id : msg.sender_id;
          const partner = isSender ? msg.receiver : msg.sender;
          
          if (msg.rooms) {
              const key = `${msg.room_id}-${partnerId}`;
              if (!conversations[key]) {
                  conversations[key] = {
                      message: msg,
                      partner: partner || { id: partnerId, full_name: 'Landlord' },
                      room: msg.rooms
                  };
              }
          }
      });
      return Object.values(conversations);
  };

  const fetchInbox = async (userId) => {
      try {
          const chatRes = await api.get(`/api/chat/my-chats/${userId}`);
          const processed = processInbox(chatRes.data, userId);
          setInboxChats(processed);
      } catch (err) {
          console.error("Error updating inbox", err);
      }
  };

  const loadDashboardData = async (userId) => {
      try {
        const sentRes = await api.get(`/api/applications/tenant/${userId}`);
        setSentApps(sentRes.data);
        await fetchInbox(userId); 
      } catch (err) {
        console.error("Error loading dashboard", err);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
          navigate('/login');
          return;
      }

      // Role check (Optimistic with cache)
      let userRole = localStorage.getItem(`role_${session.user.id}`);
      
      if (!userRole) {
          try {
              const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
              userRole = profile?.role || 'tenant';
              localStorage.setItem(`role_${session.user.id}`, userRole);
          } catch (err) {
              console.error(err);
              userRole = 'tenant';
          }
      }

      if (userRole !== 'tenant' && userRole !== 'admin') {
          toast.error("Access denied. Tenant only.");
          navigate('/');
          return;
      }

      setUser(session.user);
      await loadDashboardData(session.user.id);

      const channel = supabase
        .channel('tenant-dashboard-messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
             if (payload.new.sender_id === session.user.id || payload.new.receiver_id === session.user.id) {
                 fetchInbox(session.user.id);
             }
        })
        .subscribe();

      return () => supabase.removeChannel(channel);
    };
    fetchData();
  }, [navigate]);

  const getStatusColor = (status) => {
    if (status === 'accepted') return 'bg-green-500/10 text-green-400 border-green-500/20';
    if (status === 'rejected') return 'bg-red-500/10 text-red-400 border-red-500/20';
    return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
  };

  if (loading) {
      return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading Dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
                <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">Tenant Dashboard</h1>
                <p className="text-gray-400">Track your rental journey and communicate with landlords.</p>
            </div>
            <Link to="/map-search" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20 text-white">
                <Search size={18} /> Find Rooms
            </Link>
        </div>

        {/* Dashboard Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700 shadow-xl flex items-center gap-4 hover:border-gray-600 transition-colors">
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
                    <FileText size={28} />
                </div>
                <div>
                    <p className="text-gray-400 text-sm font-medium">Active Applications</p>
                    <h3 className="text-3xl font-bold">{sentApps.length}</h3>
                </div>
            </div>
            
            <Link to="/favorites" className="bg-gray-800 rounded-3xl p-6 border border-gray-700 shadow-xl flex items-center gap-4 hover:border-pink-500/50 hover:shadow-pink-900/10 transition-all group cursor-pointer">
                <div className="w-14 h-14 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                    <Heart size={28} />
                </div>
                <div>
                    <p className="text-gray-400 text-sm font-medium">Saved Rooms</p>
                    <h3 className="text-3xl font-bold text-gray-200 group-hover:text-white">View Saved</h3>
                </div>
            </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-800 pb-1 overflow-x-auto no-scrollbar">
          <button onClick={() => setActiveTab('applications')} className={`pb-3 px-4 flex items-center gap-2 font-medium transition-all whitespace-nowrap ${activeTab === 'applications' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500 hover:text-gray-300'}`}>
            <FileText size={18} /> My Applications ({sentApps.length})
          </button>
          <button onClick={() => setActiveTab('inbox')} className={`pb-3 px-4 flex items-center gap-2 font-medium transition-all whitespace-nowrap ${activeTab === 'inbox' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500 hover:text-gray-300'}`}>
            <MessageSquare size={18} /> Inbox ({inboxChats.length})
          </button>
        </div>

        {/* TAB 1: APPLICATIONS */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            {sentApps.length === 0 ? (
              <div className="text-center py-20 bg-gray-800/50 rounded-3xl border border-gray-800">
                  <FileText size={48} className="mx-auto text-gray-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-400 mb-2">No applications yet</h3>
                  <p className="text-gray-500">You haven't applied to any rooms. Start exploring!</p>
              </div>
            ) : sentApps.map(app => (
              <div key={app.id} className="bg-gray-800 rounded-3xl border border-gray-700 overflow-hidden flex flex-col md:flex-row hover:border-gray-600 transition-colors shadow-lg shadow-black/20">
                <div className="w-full md:w-64 h-48 md:h-auto relative bg-gray-700 shrink-0">
                  <img
                    src={app.rooms?.image_url || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"}
                    alt={app.rooms?.title}
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"; }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-sm font-bold px-3 py-1.5 rounded-lg border border-white/10">
                    ₹{app.rooms?.price}/mo
                  </div>
                </div>

                <div className="p-6 flex flex-col justify-between flex-grow min-w-0">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0 mb-3">
                      <h3 className="text-xl md:text-2xl font-bold line-clamp-1 flex-1 pr-4">
                        {app.rooms?.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs border uppercase tracking-wider font-bold whitespace-nowrap ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-400 mb-4 line-clamp-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span> {app.rooms?.location}
                    </p>

                    <div className="bg-gray-900/80 p-4 rounded-2xl border border-gray-800">
                      <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wider">Your Message to Landlord</p>
                      <p className="text-gray-300 italic text-sm line-clamp-2">"{app.message}"</p>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4 pt-4 border-t border-gray-700/50">
                    <Link
                      to={`/chat/${app.room_id}/${app.owner_id}`}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/20"
                    >
                      <MessageSquare size={18} /> Contact Landlord
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: INBOX */}
        {activeTab === 'inbox' && (
          <div className="flex flex-col gap-3">
            {inboxChats.length === 0 ? (
                <div className="text-center py-20 bg-gray-800/50 rounded-3xl border border-gray-800">
                    <MessageSquare size={48} className="mx-auto text-gray-600 mb-4" />
                    <h3 className="text-xl font-bold text-gray-400 mb-2">Inbox is empty</h3>
                    <p className="text-gray-500">You have no active conversations.</p>
                </div>
            ) : inboxChats.map((chat, idx) => (
              <Link 
                  key={idx} 
                  to={`/chat/${chat.room.id}/${chat.partner.id}`}
                  className="bg-gray-800 hover:bg-gray-750 p-4 md:p-5 rounded-2xl border border-gray-700 hover:border-blue-500/30 transition-all flex items-center gap-4 md:gap-6 group shadow-sm hover:shadow-md"
              >
                 {/* Avatar */}
                 <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center font-bold text-xl text-white shadow-inner shrink-0 rotate-3 group-hover:rotate-0 transition-transform duration-300">
                    {chat.partner.full_name ? chat.partner.full_name[0] : 'U'}
                 </div>
                 
                 {/* Content */}
                 <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-lg text-gray-100 group-hover:text-blue-400 transition-colors truncate pr-2">
                            {chat.partner.full_name || 'Landlord'}
                        </h3>
                        <span className="text-xs text-gray-400 font-medium whitespace-nowrap shrink-0">
                            {new Date(chat.message.created_at).toLocaleDateString()}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 bg-gray-900 rounded text-[10px] text-blue-400 font-bold uppercase tracking-wide border border-gray-700">
                            Re: {chat.room.title}
                        </span>
                    </div>
                    <p className="text-gray-400 text-sm truncate pr-4">
                        {chat.message.sender_id === user.id ? 'You: ' : ''}{chat.message.content}
                    </p>
                 </div>

                 {/* Action Arrow */}
                 <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 text-gray-500 group-hover:bg-blue-500 group-hover:text-white transition-colors shrink-0 border border-gray-700 group-hover:border-blue-500">
                    <ArrowRight size={18} />
                 </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default TenantDashboard;
