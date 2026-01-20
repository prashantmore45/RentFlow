import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MapPin, IndianRupee, Search, Filter } from 'lucide-react';

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [locationSearch, setLocationSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const fetchRooms = async () => {
    setLoading(true);
    try {
  
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/rooms`, {
        params: {
          location: locationSearch,
          type: typeFilter
        }
      });
      setRooms(res.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRooms();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">

      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Find Your Vibe
        </h1>

        <form onSubmit={handleSearchSubmit} className="bg-gray-800 p-4 rounded-2xl border border-gray-700 shadow-xl flex flex-col md:flex-row gap-4">

          <div className="flex-1 relative">
            <Search className="absolute left-4 top-4 text-gray-500" size={20} />
            <input 
              type="text" 
              placeholder="Search by city or area..." 
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              className="w-full pl-12 bg-gray-900 border border-gray-700 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
            />
          </div>

          <div className="w-full md:w-48 relative">
            <Filter className="absolute left-4 top-4 text-gray-500" size={20} />
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full pl-12 bg-gray-900 border border-gray-700 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 outline-none appearance-none cursor-pointer"
            >
              <option value="">Any Type</option>
              <option value="1 BHK">1 BHK</option>
              <option value="2 BHK">2 BHK</option>
              <option value="Single Room">Single Room</option>
              <option value="Shared">Shared / PG</option>
            </select>
          </div>

          <button type="submit" className="bg-purple-600 hover:bg-purple-500 px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-500/25">
            Search
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {loading ? (
          <div className="col-span-full text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Finding best matches...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-gray-800/50 rounded-3xl border border-gray-700 border-dashed">
            <h3 className="text-2xl font-bold text-gray-300 mb-2">No results found</h3>
            <p className="text-gray-500">Try changing your filters or search for a different area.</p>
            <button onClick={() => {setLocationSearch(''); setTypeFilter(''); fetchRooms();}} className="mt-4 text-purple-400 hover:text-purple-300 underline">
              Clear Filters
            </button>
          </div>
        ) : (
          rooms.map((room) => (
            <div key={room.id} className="bg-gray-800 rounded-3xl overflow-hidden hover:transform hover:-translate-y-2 transition-all duration-300 shadow-xl border border-gray-700 group">
     
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={`https://source.unsplash.com/random/800x600/?apartment,bedroom&sig=${room.id}`} 
                  alt="Room"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  onError={(e) => {e.target.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'}}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                
                <span className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold border border-white/10">
                    {room.property_type}
                </span>
                
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold text-white shadow-black drop-shadow-md">{room.title}</h3>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center text-gray-400 text-sm">
                    <MapPin size={16} className="mr-1 text-purple-400" />
                    {room.location}
                  </div>
                  <div className="flex items-center text-green-400 font-bold text-lg">
                    <IndianRupee size={18} />
                    {room.price}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-lg border border-gray-600">
                    {room.tenant_preference}
                  </span>
                </div>

                <Link to={`/room/${room.id}`} className="block w-full">
                    <button className="w-full py-3 bg-gray-700 group-hover:bg-blue-600 text-white rounded-xl font-medium transition-colors">
                        View Details
                    </button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;