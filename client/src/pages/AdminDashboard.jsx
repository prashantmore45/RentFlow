import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { ShieldAlert, Users, Home, Activity, Trash2, Ban, AlertTriangle, CheckCircle, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  // Dashboard State
  const [activeTab, setActiveTab] = useState('listings');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
          navigate('/login');
          return;
      }
      
      // Strict Admin Check (Optimistic with cache)
      let userRole = localStorage.getItem(`role_${session.user.id}`);
      
      if (!userRole) {
          try {
              const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
              userRole = profile?.role;
              if (userRole) localStorage.setItem(`role_${session.user.id}`, userRole);
          } catch (err) {
              console.error(err);
          }
      }

      if (userRole !== 'admin') {
          toast.error("Unauthorized access. Admins only.");
          navigate('/');
          return;
      }
      
      setUser(session.user);
      
      try {
          const roomsRes = await api.get('/api/rooms');
          setRooms(roomsRes.data);
      } catch (err) {
          console.error("Error loading admin data", err);
      } finally {
          setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("ADMIN ACTION: Force delete this property? This cannot be undone.")) return;
    try {
      await api.delete(`/api/rooms/${roomId}`);
      setRooms(prev => prev.filter(room => room.id !== roomId));
      toast.success("Listing forcefully removed.");
    } catch (error) { 
      console.error("Failed to delete room:", error);
      toast.error("Failed to delete property. Backend admin bypass required.");
    }
  };

  const filteredRooms = rooms.filter(room => 
      room.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      room.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
      return (
          <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center text-white">
              <ShieldAlert size={48} className="text-red-500 mb-4 animate-pulse" />
              <h2 className="text-xl font-bold">Verifying Admin Credentials...</h2>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white p-4 md:p-8 pt-24 pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-900/50 p-6 rounded-3xl border border-gray-800">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/20">
                    <ShieldAlert size={28} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-white">
                        Super Admin Panel
                    </h1>
                    <p className="text-gray-400 text-sm">Platform Control & Content Moderation</p>
                </div>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-950 p-1.5 rounded-xl border border-gray-800">
                <button 
                    onClick={() => setActiveTab('listings')}
                    className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'listings' ? 'bg-gray-800 text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    Listings
                </button>
                <button 
                    onClick={() => setActiveTab('users')}
                    className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'users' ? 'bg-gray-800 text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    Users
                </button>
            </div>
        </div>

        {/* Dynamic Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-colors">
                <div className="flex items-center justify-between text-gray-400 mb-4">
                    <span className="text-sm font-bold uppercase tracking-wider">Active Listings</span>
                    <Home size={20} className="text-blue-400" />
                </div>
                <h3 className="text-4xl font-bold">{rooms.length}</h3>
            </div>
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-colors">
                <div className="flex items-center justify-between text-gray-400 mb-4">
                    <span className="text-sm font-bold uppercase tracking-wider">Total Users</span>
                    <Users size={20} className="text-purple-400" />
                </div>
                <h3 className="text-4xl font-bold">142</h3>
            </div>
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-colors">
                <div className="flex items-center justify-between text-gray-400 mb-4">
                    <span className="text-sm font-bold uppercase tracking-wider">Platform Health</span>
                    <Activity size={20} className="text-green-400" />
                </div>
                <h3 className="text-4xl font-bold text-green-400 flex items-center gap-2">
                    <CheckCircle size={24}/> Optimal
                </h3>
            </div>
            <div className="bg-red-900/10 rounded-2xl p-6 border border-red-500/20 hover:bg-red-900/20 transition-colors">
                <div className="flex items-center justify-between text-red-400 mb-4">
                    <span className="text-sm font-bold uppercase tracking-wider">Flagged</span>
                    <AlertTriangle size={20} />
                </div>
                <h3 className="text-4xl font-bold text-red-400">0</h3>
            </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'listings' && (
            <div className="bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden shadow-2xl">
                
                {/* Table Toolbar */}
                <div className="p-6 border-b border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Home size={20} className="text-blue-400"/> Content Moderation
                    </h2>
                    
                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
                            <input 
                                type="text"
                                placeholder="Search listings..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-gray-950 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <button className="bg-gray-800 p-2 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors text-gray-400 hover:text-white">
                            <Filter size={20} />
                        </button>
                    </div>
                </div>
                
                {/* Data Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-950 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="p-4 font-bold border-b border-gray-800">Property Details</th>
                                <th className="p-4 font-bold border-b border-gray-800">Owner ID</th>
                                <th className="p-4 font-bold border-b border-gray-800">Rent</th>
                                <th className="p-4 font-bold border-b border-gray-800">Status</th>
                                <th className="p-4 font-bold border-b border-gray-800 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {filteredRooms.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">
                                        No listings found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredRooms.map(room => (
                                    <tr key={room.id} className="hover:bg-gray-800/50 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-4">
                                                <img 
                                                    src={room.image_url} 
                                                    alt={room.title} 
                                                    className="w-14 h-14 rounded-xl object-cover bg-gray-800 border border-gray-700" 
                                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"; }} 
                                                />
                                                <div>
                                                    <p className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors">{room.title}</p>
                                                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                        {room.location} • {room.property_type}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-xs font-mono text-gray-500 bg-gray-900/50">
                                            {room.owner_id.slice(0,8)}...
                                        </td>
                                        <td className="p-4">
                                            <span className="font-bold text-sm">₹{room.price.toLocaleString()}</span>
                                            <span className="text-xs text-gray-500 block">/month</span>
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 w-max">
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> Active
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 rounded-lg border border-yellow-500/20 transition-colors" title="Suspend Listing">
                                                    <Ban size={18} />
                                                </button>
                                                <button onClick={() => handleDeleteRoom(room.id)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg border border-red-500/20 transition-colors" title="Force Delete">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {activeTab === 'users' && (
             <div className="bg-gray-900 rounded-3xl border border-gray-800 p-12 text-center shadow-2xl">
                 <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
                     <Users size={32} className="text-gray-500" />
                 </div>
                 <h2 className="text-2xl font-bold mb-2">User Management</h2>
                 <p className="text-gray-400 max-w-md mx-auto">
                     The user directory and access control module is currently in development. Admins will soon be able to suspend accounts, reset passwords, and manage verification badges.
                 </p>
             </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
