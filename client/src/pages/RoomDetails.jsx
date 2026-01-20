import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, IndianRupee, User, Phone, ArrowLeft, CheckCircle } from 'lucide-react';

const RoomDetails = () => {
  const { id } = useParams(); 
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/rooms/${id}`);
        setRoom(res.data);
      } catch (error) {
        console.error("Error fetching room details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

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

             <h2 className="text-xl font-semibold mb-3 border-b border-gray-700 pb-2">Description</h2>
             <p className="text-gray-400 leading-relaxed">
               This {room.property_type} is located in a prime area of {room.location}. 
               Perfect for {room.tenant_preference} looking for a peaceful stay.
               (You can add more description fields to your database later to populate this area).
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

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-xl">
                <Phone className="text-blue-400" />
                <div>
                  <p className="text-xs text-gray-400">Landlord Contact</p>
                  <p className="font-semibold">{room.contact_number}</p>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg transform hover:scale-[1.02]">
                Apply Now
              </button>
              
              <p className="text-xs text-center text-gray-500">
                <CheckCircle size={12} className="inline mr-1" />
                Verified Listing
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RoomDetails;