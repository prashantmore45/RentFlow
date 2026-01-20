import { useEffect, useState } from 'react';
import axios from 'axios';
import { supabase } from '../supabase';
import { CheckCircle, XCircle, Send, Inbox, Clock } from 'lucide-react';

const Dashboard = () => {
  const [sentApps, setSentApps] = useState([]);
  const [receivedApps, setReceivedApps] = useState([]);
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
      } catch (err) {
        console.error("Error loading dashboard", err);
      }
    };
    fetchData();
  }, []);

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

        <div className="flex gap-4 mb-8 border-b border-gray-700 pb-1 overflow-x-auto">
          <button onClick={() => setActiveTab('sent')} className={`pb-3 px-4 flex items-center gap-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'sent' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}>
            <Send size={18} /> Sent Applications ({sentApps.length})
          </button>
          <button onClick={() => setActiveTab('received')} className={`pb-3 px-4 flex items-center gap-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'received' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400'}`}>
            <Inbox size={18} /> Received Applications ({receivedApps.length})
          </button>
        </div>

        {activeTab === 'sent' && (
          <div className="space-y-4">
             {sentApps.length === 0 ? <p className="text-gray-500">No applications sent.</p> : sentApps.map(app => (
              <div key={app.id} className="bg-gray-800 p-6 rounded-2xl border border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{app.rooms?.title}</h3>
                  <p className="text-gray-400 text-sm">₹{app.rooms?.price} • {app.rooms?.location}</p>
                </div>
                <div className={`px-4 py-2 rounded-full border capitalize font-bold text-sm ${getStatusColor(app.status)}`}>
                  {app.status}
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
                        <p className="text-sm text-gray-400">For Room: {app.rooms?.title}</p>
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
      </div>
    </div>
  );
};

export default Dashboard;