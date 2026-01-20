import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { supabase } from '../supabase'; 
import { MapPin, IndianRupee, User, Phone, ArrowLeft, CheckCircle, Send } from 'lucide-react';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/rooms/${id}`);
        setRoom(res.data);
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
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/applications`, {
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
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
      </Link>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
             <h1 className="text-3xl font-bold mb-4">{room.title}</h1>
             <div className="flex flex-wrap gap-4 text-gray-300 mb-6">
               <span className="flex items-center bg-gray-700 px-3 py-1 rounded-lg text-sm">
                 <MapPin size={16} className="mr-2 text-blue-400" /> {room.location}
               </span>
               <span className="flex items-center bg-gray-700 px-3 py-1 rounded-lg text-sm">
                 <User size={16} className="mr-2 text-purple-400" /> {room.tenant_preference}
               </span>
             </div>
             <p className="text-gray-400 leading-relaxed">
               This {room.property_type} is located in {room.location}. Rent: ₹{room.price}.
             </p>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700 sticky top-8">
            <div className="mb-6">
              <p className="text-gray-400 text-sm">Monthly Rent</p>
              <h3 className="text-3xl font-bold text-green-400 flex items-center">
                <IndianRupee size={24} /> {room.price}
              </h3>
            </div>

            {currentUser && currentUser.id === room.owner_id ? (
                <div className="p-4 bg-yellow-500/10 text-yellow-500 rounded-xl text-center border border-yellow-500/20">
                    You own this room
                </div>
            ) : (
                <button 
                    onClick={handleApply}
                    disabled={applying}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg transform hover:scale-[1.02] disabled:opacity-50 flex justify-center items-center gap-2"
                >
                    {applying ? 'Sending...' : <><Send size={18}/> Apply Now</>}
                </button>
            )}
            
            <p className="text-xs text-center text-gray-500 mt-4">
               <CheckCircle size={12} className="inline mr-1" />
               Verified Listing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;