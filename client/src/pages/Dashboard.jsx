import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { Send, Inbox, Home, Trash2, Edit } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [sentApps, setSentApps] = useState([]);
  const [receivedApps, setReceivedApps] = useState([]);
  const [myRooms, setMyRooms] = useState([]); 
  const [activeTab, setActiveTab] = useState('sent');

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      try {
        const sentRes = await axios.get(`${apiUrl}/api/applications/tenant/${user.id}`);
        setSentApps(sentRes.data);

        const receivedRes = await axios.get(`${apiUrl}/api/applications/landlord/${user.id}`);
        setReceivedApps(receivedRes.data);

        const roomsRes = await axios.get(`${apiUrl}/api/rooms/my-rooms/${user.id}`);
        setMyRooms(roomsRes.data);

      } catch (err) {
        console.error("Error loading dashboard", err);
      }
    };
    fetchData();
  }, []);

  const handleDeleteRoom = async (roomId) => {
    if (!confirm("Are you sure you want to delete this listing? This cannot be undone.")) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.delete(`${apiUrl}/api/rooms/${roomId}`);
      setMyRooms(prev => prev.filter(room => room.id !== roomId));
      alert("Room deleted successfully.");
    } catch (error) {
      console.error("Error", error);
      alert("Failed to delete room.");
    }
  };

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.patch(`${apiUrl}/api/applications/${appId}`, { status: newStatus });

      setReceivedApps(prev => prev.map(app => 
        app.id === appId ? { ...app, status: newStatus } : app
      ));
      alert(`Application marked as ${newStatus}`);
    } catch (error) {
      console.error("Error", error);
      alert("Failed to update status");
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
        </div>

        {activeTab === 'sent' && (
          <div className="space-y-4">
            {sentApps.length === 0 ? <p className="text-gray-500">No applications sent.</p> : sentApps.map(app => (
              <div key={app.id} className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden flex flex-col md:flex-row">
                <div className="w-full md:w-48 h-48 md:h-auto relative bg-gray-700 shrink-0">
                  <img 
                      src={app.rooms?.image_url || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"} 
                      alt={app.rooms?.title}
                      onError={(e) => { 
                          e.target.onerror = null; 
                          e.target.src = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"; 
                      }}
                      className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                      ₹{app.rooms?.price}/mo
                  </div>
                </div>

                <div className="p-6 flex flex-col justify-center flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white line-clamp-1">{app.rooms?.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs border capitalize font-bold shrink-0 ml-2 ${getStatusColor(app.status)}`}>
                        {app.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4">{app.rooms?.location}</p>
                  
                  <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
                    <p className="text-xs text-gray-500 mb-1">Your Message:</p>
                    <p className="text-gray-300 italic text-sm">"{app.message}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'received' && (
          <div className="space-y-4">
            {receivedApps.length === 0 ? <p className="text-gray-500">No applications received.</p> : receivedApps.map(app => (
              <div key={app.id} className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                    <div>
                        <h3 className="text-lg font-bold text-white">Applicant: <span className="text-purple-400">User...{app.applicant_id.slice(0,4)}</span></h3>
                        <p className="text-sm text-gray-400 mt-2">For Room: {app.rooms?.title}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs border capitalize ${getStatusColor(app.status)}`}>
                        {app.status}
                    </span>
                 </div>
                 <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 mb-4">
                    <p className="text-gray-300 italic">"{app.message}"</p>
                 </div>
                 {app.status === 'pending' && (
                   <div className="flex gap-3">
                      <button onClick={() => handleStatusUpdate(app.id, 'accepted')} className="flex-1 bg-green-600/20 text-green-400 hover:bg-green-600/30 py-2 rounded-lg border border-green-600/30 font-medium transition-colors">Accept</button>
                      <button onClick={() => handleStatusUpdate(app.id, 'rejected')} className="flex-1 bg-red-600/20 text-red-400 hover:bg-red-600/30 py-2 rounded-lg border border-red-600/30 font-medium transition-colors">Reject</button>
                   </div>
                 )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myRooms.length === 0 ? <p className="text-gray-500">You haven't posted any rooms yet.</p> : myRooms.map(room => (
              <div key={room.id} className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden group hover:border-green-500/50 transition-all">

                <div className="h-48 w-full relative bg-gray-700">
                   <img 
                      src={room.image_url || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"} 
                      alt={room.title}
                      onError={(e) => { 
                          e.target.onerror = null; 
                          e.target.src = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"; 
                      }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                   />
                   <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                      ₹{room.price}/mo
                   </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-1 truncate">{room.title}</h3>
                  <p className="text-sm text-gray-400 mb-4">{room.location}</p>

                  <div className="flex gap-3 mt-4">
                      <button 
                          onClick={() => navigate(`/edit-room/${room.id}`)} 
                          className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium"
                      >
                          <Edit size={16} /> Edit
                      </button>

                      <button 
                          onClick={() => handleDeleteRoom(room.id)}
                          className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium"
                      >
                          <Trash2 size={16} /> Delete
                      </button>
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

export default Dashboard;