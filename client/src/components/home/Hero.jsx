import { useState } from 'react';
import { MapPin, Filter, Search, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = ({ user, onSearch }) => {
    const navigate = useNavigate();
    const [locationSearch, setLocationSearch] = useState('');
    const [typeSearch, setTypeSearch] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
        } else {
            onSearch(locationSearch, typeSearch);
        }
    };

    return (
        <div className="relative min-h-[500px] flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center bg-fixed">
            <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"></div>
            
            <div className="relative z-10 text-center w-full max-w-5xl px-4 py-20">
                {user ? (
                    <span className="inline-block py-1 px-3 rounded-full bg-green-500/20 border border-green-400/30 text-green-300 text-sm font-semibold mb-6">
                        👋 Welcome back, {user.user_metadata?.name || 'Explorer'}
                    </span>
                ) : (
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-semibold mb-6">
                        🚀 The #1 Rental Housing Platform
                    </span>
                )}

                <h1 className="font-heading text-4xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
                    Find Your <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Flow</span>, <br />
                    Find Your <span className="text-white">Home.</span>
                </h1>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur-md p-3 md:p-4 rounded-3xl border border-white/20 shadow-2xl flex flex-col md:flex-row gap-3 max-w-4xl mx-auto">
                    <div className="flex-1 relative group">
                        <MapPin className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Where do you want to live?" 
                            value={locationSearch}
                            onChange={(e) => setLocationSearch(e.target.value)}
                            className="w-full bg-gray-900/80 border border-gray-600 rounded-2xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    {user && (
                        <div className="relative md:w-48 group">
                            <Filter className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-purple-400" size={20} />
                            <select 
                                value={typeSearch}
                                onChange={(e) => setTypeSearch(e.target.value)}
                                className="w-full bg-gray-900/80 border border-gray-600 rounded-2xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-purple-500 outline-none appearance-none cursor-pointer"
                            >
                                <option value="">Any Type</option>
                                <option value="1 BHK">1 BHK</option>
                                <option value="2 BHK">2 BHK</option>
                                <option value="Single Room">Single Room</option>
                                <option value="Shared">Shared / PG</option>
                            </select>
                        </div>
                    )}
                    <button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-8 rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
                        {user ? <Search size={20} /> : <Lock size={18} />}
                        {user ? 'Search' : 'Login to Search'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Hero;
