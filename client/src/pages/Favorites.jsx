import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { MapPin, IndianRupee, ArrowLeft, HeartOff, ArrowRight } from 'lucide-react';

const Favorites = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
          navigate('/login');
          return;
      }

      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        
        const { data: likedIds } = await axios.get(`${apiUrl}/api/favorites/${user.id}`);
        
        if (likedIds.length === 0) {
            setLoading(false);
            return;
        }

        const { data: allRooms } = await axios.get(`${apiUrl}/api/rooms`);
        const likedRooms = allRooms.filter(room => likedIds.includes(room.id));
        
        setRooms(likedRooms);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [navigate]);

return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
            
            <div className="flex items-center gap-4 mb-8">
                    <Link to="/" className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                            <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-3xl font-bold">My Saved Rooms</h1>
            </div>

            {loading ? (
                 <div className="flex justify-center py-20">
                         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                 </div>
            ) : rooms.length === 0 ? (
                    <div className="text-center py-20 bg-gray-800/50 rounded-3xl border border-gray-700">
                            <HeartOff size={64} className="mx-auto text-gray-600 mb-4" />
                            <h2 className="text-2xl font-bold text-gray-400 mb-2">No favorites yet</h2>
                            <p className="text-gray-500 mb-6">Start exploring and save rooms you love!</p>
                            <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-500 transition-colors">
                                    Browse Rooms
                            </Link>
                    </div>
            ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {rooms.map(room => (
                                    <Link to={`/room/${room.id}`} key={room.id} className="group bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all block">
                                            <div className="h-56 overflow-hidden relative">
                                                    <img 
                                                        src={room.image_url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&auto=format'} 
                                                        alt={room.title} 
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&auto=format'; }}
                                                    />
                                                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                                            <IndianRupee size={14} /> {room.price}
                                                    </div>
                                            </div>
                                            <div className="p-5">
                                                    <h3 className="text-xl font-bold mb-2 truncate">{room.title}</h3>
                                                    <div className="flex items-center text-gray-400 text-sm mb-4">
                                                            <MapPin size={16} className="mr-2 text-purple-400" />
                                                            <span className="truncate">{room.location}</span>
                                                    </div>
                                                    <div className="pt-4 border-t border-gray-700 flex justify-between items-center text-blue-400 font-bold text-sm">
                                                            View Details <ArrowRight size={16} />
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

export default Favorites;