import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, MapPin, IndianRupee, Home as HomeIcon, Filter } from 'lucide-react';

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
 
  const [locationSearch, setLocationSearch] = useState('');
  const [typeSearch, setTypeSearch] = useState('');

  const fetchRooms = async (location = '', type = '') => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      let queryUrl = `${apiUrl}/api/rooms`;
      const params = new URLSearchParams();
      
      if (location) params.append('location', location);
      if (type) params.append('type', type);
      
      if (params.toString()) queryUrl += `?${params.toString()}`;

      const res = await axios.get(queryUrl);
      setRooms(res.data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRooms(locationSearch, typeSearch);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      
      {/* HERO SECTION */}
      <div className="relative h-[500px] flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-gray-900 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-purple-500 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-blue-500 blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">
            Find Your Perfect Room
          </h1>
          <p className="text-xl text-gray-300 mb-10">
            Search hundreds of verified listings for students and professionals.
          </p>

          {/* SEARCH BAR */}
          <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-2xl flex flex-col md:flex-row gap-4">
            
            {/* Location Input */}
            <div className="flex-1 relative group">
                <MapPin className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-400 transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Enter City, Area, or Zip..." 
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  className="w-full bg-gray-900/60 border border-gray-600 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-500"
                />
            </div>

            {/* Type Dropdown */}
            <div className="relative md:w-48 group">
                <Filter className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-purple-400 transition-colors" size={20} />
                <select 
                  value={typeSearch}
                  onChange={(e) => setTypeSearch(e.target.value)}
                  className="w-full bg-gray-900/60 border border-gray-600 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-purple-500 outline-none appearance-none cursor-pointer"
                >
                    <option value="">All Types</option>
                    <option value="1 BHK">1 BHK</option>
                    <option value="2 BHK">2 BHK</option>
                    <option value="Single Room">Single Room</option>
                    <option value="Shared">Shared / PG</option>
                </select>
            </div>

            {/* Search Button */}
            <button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-purple-500/30 active:scale-95 flex items-center justify-center gap-2">
                <Search size={20} /> Search
            </button>
          </form>
        </div>
      </div>

      {/* RESULTS SECTION */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-end mb-8 border-b border-gray-800 pb-4">
            <div>
                <h2 className="text-3xl font-bold">Latest Listings</h2>
                <p className="text-gray-400 mt-1">
                    {rooms.length} {rooms.length === 1 ? 'result' : 'results'} found
                    {(locationSearch || typeSearch) && <span className="text-blue-400 ml-1">(Filtered)</span>}
                </p>
            </div>
            
            {(locationSearch || typeSearch) && (
                <button 
                    onClick={() => { setLocationSearch(''); setTypeSearch(''); fetchRooms(); }}
                    className="text-sm text-red-400 hover:text-red-300 underline"
                >
                    Clear Filters
                </button>
            )}
        </div>

        {loading ? (
           <div className="flex justify-center py-20">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.length === 0 ? (
                <div className="col-span-full text-center py-20 bg-gray-800/50 rounded-3xl border border-gray-800">
                    <Search size={48} className="mx-auto text-gray-600 mb-4" />
                    <h3 className="text-xl font-bold text-gray-300">No rooms found</h3>
                    <p className="text-gray-500">Try adjusting your search criteria</p>
                </div>
            ) : rooms.map(room => (
              <Link to={`/room/${room.id}`} key={room.id} className="group bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 block">
                
                {/* Image Container */}
                <div className="h-64 overflow-hidden relative">
                    <img 
                      src={room.image_url || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"} 
                      alt={room.title}
                      onError={(e) => { 
                          e.target.onerror = null; 
                          e.target.src = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"; 
                      }}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80"></div>
                    
                    <div className="absolute bottom-4 left-4">
                        <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md mb-2 inline-block">
                            {room.property_type}
                        </span>
                        <h3 className="text-xl font-bold text-white truncate w-64">{room.title}</h3>
                    </div>
                    
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full font-bold border border-white/10 flex items-center gap-1">
                        <IndianRupee size={14} /> {room.price}
                    </div>
                </div>

                {/* Details Container */}
                <div className="p-5">
                    <div className="flex items-center text-gray-400 mb-2">
                        <MapPin size={16} className="mr-2 text-purple-400" />
                        <span className="truncate">{room.location}</span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
                        <span className="text-sm text-gray-500">
                             Prefers: <span className="text-gray-300 font-medium">{room.tenant_preference}</span>
                        </span>
                        <span className="text-blue-400 text-sm font-semibold group-hover:underline">
                            View Details →
                        </span>
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

export default Home;