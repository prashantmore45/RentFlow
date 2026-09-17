import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { Home, Inbox, BarChart2, Edit, Trash2, MessageCircle, PlusCircle, CheckCircle, XCircle, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

const HostDashboard = () => {
  const navigate = useNavigate();
  
  const [receivedApps, setReceivedApps] = useState([]);
  const [myRooms, setMyRooms] = useState([]); 
  const [activeTab, setActiveTab] = useState('properties');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const loadDashboardData = async (userId) => {
      try {
        const roomsRes = await api.get(`/api/rooms/my-rooms/${userId}`);
        setMyRooms(roomsRes.data);

        const receivedRes = await api.get(`/api/applications/landlord/${userId}`);
        setReceivedApps(receivedRes.data);
      } catch (err) {
        console.error("Error loading dashboard", err);
        toast.error("Failed to load host data");
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

      if (userRole !== 'landlord' && userRole !== 'admin') {
          toast.error("Access denied. Landlord only.");
          navigate('/');
          return;
      }

      setUser(session.user);
      await loadDashboardData(session.user.id);
    };
    fetchData();
  }, [navigate]);

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this property? This cannot be undone.")) return;
    try {
      await api.delete(`/api/rooms/${roomId}`);
      setMyRooms(prev => prev.filter(room => room.id !== roomId));
      toast.success("Property deleted.");
    } catch (error) { 
      console.error("Failed to delete room:", error);
      toast.error("Failed to delete property.");
    }
  };

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      await api.patch(`/api/applications/${appId}`, { status: newStatus });
      setReceivedApps(prev => prev.map(app => app.id === appId ? { ...app, status: newStatus } : app));
      toast.success(`Application ${newStatus}!`);
    } catch (error) { 
      console.error("Failed to update application status:", error);
      toast.error("Failed to update status."); 
    }
  };

  if (loading) {
      return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading Host Dashboard...</div>;
  }

  // Simulated Insights logic based on property count
  const totalViews = myRooms.length * 342;
  const totalFavorites = myRooms.length * 28;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
                <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Host Dashboard</h1>
                <p className="text-gray-400">Manage your properties and review potential tenants.</p>
            </div>
            <Link to="/add-room" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-green-900/20 text-white">
                <PlusCircle size={18} /> Add New Property
            </Link>
        </div>

        {/* Premium Insights Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700 shadow-xl flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
                    <Home size={28} />
                </div>
                <div>
                    <p className="text-gray-400 text-sm font-medium">Active Properties</p>
                    <h3 className="text-3xl font-bold">{myRooms.length}</h3>
                </div>
            </div>
            <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700 shadow-xl flex items-center gap-4 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity"><BarChart2 size={100}/></div>
                <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400">
                    <BarChart2 size={28} />
                </div>
                <div>
                    <p className="text-gray-400 text-sm font-medium">Total Views (30d)</p>
                    <h3 className="text-3xl font-bold">{totalViews}</h3>
                </div>
            </div>
            <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700 shadow-xl flex items-center gap-4">
                <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-400">
                    <Heart size={28} />
                </div>
                <div>
                    <p className="text-gray-400 text-sm font-medium">Total Saves (30d)</p>
                    <h3 className="text-3xl font-bold">{totalFavorites}</h3>
                </div>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-800 pb-1 overflow-x-auto no-scrollbar">
          <button onClick={() => setActiveTab('properties')} className={`pb-3 px-4 flex items-center gap-2 font-medium transition-all whitespace-nowrap ${activeTab === 'properties' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-500 hover:text-gray-300'}`}>
            <Home size={18} /> My Properties ({myRooms.length})
          </button>
          <button onClick={() => setActiveTab('applications')} className={`pb-3 px-4 flex items-center gap-2 font-medium transition-all whitespace-nowrap ${activeTab === 'applications' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500 hover:text-gray-300'}`}>
            <Inbox size={18} /> Applications ({receivedApps.length})
          </button>
        </div>

        {/* TAB 1: PROPERTIES */}
        {activeTab === 'properties' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myRooms.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-gray-800/50 rounded-3xl border border-gray-800">
                  <Home size={48} className="mx-auto text-gray-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-400 mb-2">No properties listed</h3>
                  <p className="text-gray-500 mb-6">You haven't added any properties to RentFlow yet.</p>
                  <Link to="/add-room" className="inline-flex bg-green-600 text-white font-bold px-6 py-2 rounded-xl hover:bg-green-500">Post a Room</Link>
              </div>
            ) : myRooms.map(room => (
              <div key={room.id} className="bg-gray-800 rounded-3xl border border-gray-700 overflow-hidden group hover:border-green-500/50 hover:shadow-2xl hover:shadow-green-900/10 transition-all flex flex-col">
                <div className="h-48 w-full relative bg-gray-700 overflow-hidden">
                  <img
                    src={room.image_url || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"}
                    alt={room.title}
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"; }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-sm font-bold px-3 py-1 rounded-lg border border-white/10">
                    ₹{room.price}/mo
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold truncate mb-1">{room.title}</h3>
                  <p className="text-sm text-gray-400 mb-6 truncate">{room.location}</p>

                  <div className="mt-auto flex gap-3">
                    <button
                      onClick={() => navigate(`/edit-room/${room.id}`)}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                      <Edit size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteRoom(room.id)}
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold px-4 rounded-xl flex items-center justify-center transition-colors border border-red-500/20"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: APPLICATIONS BOARD */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            {receivedApps.length === 0 ? (
                <div className="text-center py-20 bg-gray-800/50 rounded-3xl border border-gray-800">
                    <Inbox size={48} className="mx-auto text-gray-600 mb-4" />
                    <h3 className="text-xl font-bold text-gray-400 mb-2">No applications yet</h3>
                    <p className="text-gray-500">When tenants apply to your properties, they will appear here.</p>
                </div>
            ) : receivedApps.map(app => (
              <div key={app.id} className="bg-gray-800 p-6 rounded-3xl border border-gray-700 shadow-xl flex flex-col md:flex-row gap-6">
                 {/* Applicant Info */}
                 <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-gray-700 pb-6 md:pb-0 md:pr-6 flex flex-col">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center font-bold text-xl text-white shadow-lg shrink-0">
                            {app.profiles?.full_name ? app.profiles.full_name[0] : 'U'}
                        </div>
                        <div>
                            <h3 className="font-bold text-xl text-white truncate">
                                {app.profiles?.full_name || 'Anonymous User'}
                            </h3>
                            <p className="text-sm text-gray-400">Applicant</p>
                        </div>
                    </div>
                    {app.status === 'pending' && (
                        <div className="mt-auto flex gap-2">
                            <button onClick={() => handleStatusUpdate(app.id, 'accepted')} className="flex-1 py-2 bg-green-500/10 text-green-400 font-bold rounded-xl border border-green-500/20 hover:bg-green-500/20 flex items-center justify-center gap-1"><CheckCircle size={16}/> Accept</button>
                            <button onClick={() => handleStatusUpdate(app.id, 'rejected')} className="flex-1 py-2 bg-red-500/10 text-red-400 font-bold rounded-xl border border-red-500/20 hover:bg-red-500/20 flex items-center justify-center gap-1"><XCircle size={16}/> Reject</button>
                        </div>
                    )}
                    {app.status !== 'pending' && (
                        <div className="mt-auto">
                            <span className={`inline-block px-4 py-2 rounded-xl text-sm border font-bold uppercase tracking-wider ${app.status === 'accepted' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                {app.status}
                            </span>
                        </div>
                    )}
                 </div>

                 {/* Application Details */}
                 <div className="md:w-2/3 flex flex-col">
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Applying For</h4>
                    <Link to={`/room/${app.rooms?.id}`} className="block bg-gray-900 rounded-2xl p-4 border border-gray-800 hover:border-blue-500/50 transition-colors mb-4 group">
                        <p className="font-bold text-white group-hover:text-blue-400 truncate">{app.rooms?.title}</p>
                        <p className="text-sm text-gray-400 truncate">{app.rooms?.location}</p>
                    </Link>

                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Message</h4>
                    <div className="bg-gray-900/50 rounded-2xl p-4 border border-gray-800 mb-4 flex-grow">
                        <p className="text-gray-300 italic text-sm">"{app.message}"</p>
                    </div>

                    <div className="flex justify-end">
                        <Link to={`/chat/${app.room_id}/${app.applicant_id}`} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/20">
                            <MessageCircle size={18}/> Message Applicant
                        </Link>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default HostDashboard;
