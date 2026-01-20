import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { supabase } from '../supabase';
import { MapPin, IndianRupee, User, ArrowLeft, CheckCircle, Send, ShieldCheck } from 'lucide-react'; 

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [landlord, setLandlord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

        const roomRes = await axios.get(`${apiUrl}/api/rooms/${id}`);
        setRoom(roomRes.data);

        const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', roomRes.data.owner_id)
            .single();
        
        if (profileData) setLandlord(profileData);

      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [id]);

  const handleApply = async () => {
    if (!currentUser) {
      alert("Please login to apply!");
      navigate('/login');
      return;
    }

    const message = prompt("Write a short message to the landlord (e.g. 'I am a software engineer, non-smoker'):");
    if (!message) return; 

    setApplying(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.post(`${apiUrl}/api/applications`, {
        room_id: room.id,
        owner_id: room.owner_id,
        applicant_id: currentUser.id,
        message: message
      });
      alert("Application Sent! The landlord will contact you.");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;
  if (!room) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Room not found</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
      </Link>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
 
        <div className="md:col-span-2 space-y-6">
          
          <div className="h-64 md:h-96 w-full relative rounded-3xl overflow-hidden group shadow-2xl">
            <img 
                src={room.image_url || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80"} 
                alt={room.title}
                onError={(e) => { e.target.onerror = null; e.target.src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80" }}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6">
                <div className="bg-blue-600/90 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-2">
                    {room.property_type}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold shadow-black drop-shadow-lg">{room.title}</h1>
            </div>
          </div>

          <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700">
             <div className="flex flex-wrap gap-4 text-gray-300 mb-6">
               <span className="flex items-center bg-gray-700/50 px-4 py-2 rounded-xl text-sm border border-gray-600">
                 <MapPin size={18} className="mr-2 text-blue-400" /> {room.location}
               </span>
               <span className="flex items-center bg-gray-700/50 px-4 py-2 rounded-xl text-sm border border-gray-600">
                 <User size={18} className="mr-2 text-purple-400" /> Prefers: {room.tenant_preference}
               </span>
             </div>
             
             <h3 className="text-xl font-bold mb-3 text-white">About this place</h3>
             <p className="text-gray-400 leading-relaxed">
               Located in the heart of {room.location}, this property offers a comfortable living space for {room.tenant_preference}s. 
               Contact the landlord to schedule a visit.
             </p>
          </div>
        </div>

        <div className="md:col-span-1 space-y-6">
          
          <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700 shadow-xl">
            <div className="mb-6">
              <p className="text-gray-400 text-sm mb-2">Monthly Rent</p>
              <h3 className="text-3xl font-bold text-green-400 flex items-center">
                <IndianRupee size={28} /> {room.price}
              </h3>
            </div>

            {currentUser && currentUser.id === room.owner_id ? (
                <div className="p-4 bg-yellow-500/10 text-yellow-500 rounded-xl text-center border border-yellow-500/20 font-bold">
                    You own this property
                </div>
            ) : (
                <button 
                    onClick={handleApply}
                    disabled={applying}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-purple-900/20 flex justify-center items-center gap-2"
                >
                    {applying ? 'Sending...' : <><Send size={18}/> Apply Now</>}
                </button>
            )}
            
            <p className="text-xs text-center text-gray-500 mt-4 flex items-center justify-center gap-1">
               <ShieldCheck size={14} className="text-green-500" /> Verified Listing
            </p>
          </div>

          {/* --- NEW: LANDLORD PROFILE CARD --- */}
          <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700 shadow-xl">
             <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-4">Meet the Landlord</h3>
             
             <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700 border-2 border-purple-500">
                    {landlord?.avatar_url ? (
                        <img src={landlord.avatar_url} alt="Landlord" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400"><User size={24}/></div>
                    )}
                </div>
                <div>
                    <h4 className="text-lg font-bold text-white">
                        {landlord?.full_name || "Room Owner"}
                    </h4>
                    <p className="text-xs text-gray-400">Joined recently</p>
                </div>
             </div>

             {landlord?.bio && (
                 <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50 text-sm text-gray-300 italic">
                    "{landlord.bio}"
                 </div>
             )}

             <div className="mt-4 pt-4 border-t border-gray-700">
                 <p className="text-sm text-gray-400 flex items-center gap-2">
                    <User size={14}/> Contact: <span className="text-white font-mono">{room.contact_number}</span>
                 </p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RoomDetails;