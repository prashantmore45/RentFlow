import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { 
  Search, MapPin, IndianRupee, CheckCircle, Shield, Clock, Users, 
  Star, ArrowRight, Filter, Lock, HelpCircle, MessageCircle, Key 
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  
  // Search States
  const [locationSearch, setLocationSearch] = useState('');
  const [typeSearch, setTypeSearch] = useState('');

  // Define Categories for rows
  const categories = ["1 BHK", "2 BHK", "Single Room", "Shared", "Villa"];

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();
    fetchRooms();
  }, []);

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
      setRooms(res.data.reverse()); 
    } catch (err) {
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!user) {
        navigate('/login'); 
    } else {
        fetchRooms(locationSearch, typeSearch); 
    }
  };

  // handle guest clicks
  const handleGuestClick = (e) => {
      e.preventDefault();
      navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans selection:bg-purple-500 selection:text-white pb-20">
      
      {/* 0. HIDE SCROLLBAR BUT KEEP FUNCTIONALITY */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>


      {/* 1. HERO SECTION */}
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

          <h1 className="text-4xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
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


      {/* 2. STATS (GUEST ONLY) */}
      {!user && (
        <div className="border-y border-gray-800 bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { label: "Active Listings", val: "1,200+", icon: <CheckCircle className="text-green-400 mb-2 mx-auto" /> },
                { label: "Happy Tenants", val: "850+", icon: <Users className="text-blue-400 mb-2 mx-auto" /> },
                { label: "Cities Covered", val: "12", icon: <MapPin className="text-purple-400 mb-2 mx-auto" /> },
                { label: "Average Rating", val: "4.8/5", icon: <Star className="text-yellow-400 mb-2 mx-auto" /> },
            ].map((stat, idx) => (
                <div key={idx} className="group">
                    {stat.icon}
                    <h3 className="text-3xl font-bold text-white mb-1 group-hover:scale-110 transition-transform">{stat.val}</h3>
                    <p className="text-gray-500 text-sm uppercase tracking-wider">{stat.label}</p>
                </div>
            ))}
          </div>
        </div>
      )}


      {/* 3. LISTINGS (The Product) */}
      <div className="max-w-[95rem] mx-auto px-4 py-16">
        
        {loading ? (
           <div className="flex justify-center py-20">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
           </div>
        ) : (
          <>
            {/* SCENARIO A: GUEST (Show Latest 3) */}
            {!user ? (
               <div>
                  <div className="flex justify-between items-end mb-8 px-2">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-2">Fresh on the Market</h2>
                        <p className="text-gray-400">Join to see full details and apply.</p>
                    </div>
                    <Link to="/login" className="hidden md:flex items-center gap-2 text-blue-400 font-semibold hover:text-blue-300 transition-colors">
                        Login to View All <ArrowRight size={20} />
                    </Link>
                  </div>
                  
                  {/* Horizontal Scroll Container */}
                  <div className="flex gap-6 overflow-x-auto pb-8 snap-x mandatory scrollbar-hide px-2">
                    {rooms.slice(0, 4).map(room => (
                      <Link 
                        to={`/room/${room.id}`} 
                        key={room.id} 
                        onClick={handleGuestClick} 
                        className="min-w-[85vw] md:min-w-[400px] snap-center group bg-gray-800 rounded-3xl overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-all cursor-pointer"
                      >
                        <RoomCardContent room={room} isGuest={true} />
                      </Link>
                    ))}
                  </div>
               </div>
            ) : (
               /* SCENARIO B: LOGGED IN USER */
               <div className="space-y-16">
                  {/* If searching, show Grid. If browsing, show Categories */}
                  {(locationSearch || typeSearch) ? (
                      <div>
                          <h2 className="text-2xl font-bold mb-6 px-2">Search Results</h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                              {rooms.map(room => (
                                  <Link to={`/room/${room.id}`} key={room.id} className="group bg-gray-800 rounded-3xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all block">
                                      <RoomCardContent room={room} isGuest={false} />
                                  </Link>
                              ))}
                          </div>
                      </div>
                  ) : (
                      // CATEGORY ROWS
                      categories.map((category) => {
                          const categoryRooms = rooms.filter(r => r.property_type === category || (category === 'Shared' && r.property_type.includes('Shared')));
                          if (categoryRooms.length === 0) return null;

                          return (
                              <div key={category}>
                                  <div className="flex items-center gap-3 mb-6 px-2">
                                      <h2 className="text-2xl font-bold text-white">{category}s</h2>
                                      <span className="text-sm text-gray-500 font-medium bg-gray-800 px-2 py-1 rounded-md">{categoryRooms.length}</span>
                                  </div>
                                  
                                  {/* Horizontal Scroll Container */}
                                  <div className="flex gap-6 overflow-x-auto pb-4 snap-x mandatory scrollbar-hide px-2">
                                      {categoryRooms.map(room => (
                                          <Link 
                                            to={`/room/${room.id}`} 
                                            key={room.id} 
                                            className="min-w-[85vw] md:min-w-[350px] snap-center group bg-gray-800 rounded-3xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all block"
                                          >
                                              <RoomCardContent room={room} isGuest={false} />
                                          </Link>
                                      ))}
                                  </div>
                              </div>
                          )
                      })
                  )}
               </div>
            )}
          </>
        )}
      </div>


      {/* 4. MARKETING (GUEST ONLY) */}
      {!user && (
        <>
          {/* HOW IT WORKS */}
          <div className="py-20 bg-gray-800/30">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-12">How RentFlow Works ?</h2>
                <div className="grid md:grid-cols-3 gap-8 relative">
                    <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-gray-700 -z-10"></div>
                    {[
                        { title: "Search", desc: "Browse thousands of verified listings by location and price.", icon: <Search size={32} /> },
                        { title: "Connect", desc: "Chat directly with landlords. No hidden agent fees.", icon: <MessageCircle size={32} /> },
                        { title: "Move In", desc: "Seal the deal and move into your new home hassle-free.", icon: <Key size={32} /> }
                    ].map((step, i) => (
                        <div key={i} className="relative bg-gray-900 p-8 rounded-3xl border border-gray-800 shadow-xl">
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg shadow-blue-500/20">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3">0{i+1}. {step.title}</h3>
                            <p className="text-gray-400">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
          </div>

          {/* FEATURES */}
          <div className="py-24 bg-gray-900">
             <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Choose Us?</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">We are not just a listing site. We are a complete rental ecosystem designed for safety and speed.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { title: "Verified Listings", desc: "Every home is physically verified by our team to ensure zero fraud.", icon: <Shield size={40} className="text-blue-500" /> },
                        { title: "Direct Connection", desc: "Connect directly with landlords. No middle-men, no hidden brokerage fees.", icon: <Users size={40} className="text-purple-500" /> },
                        { title: "Fast Approval", desc: "Apply online and get approved in hours, not weeks. Move in faster.", icon: <Clock size={40} className="text-green-500" /> },
                    ].map((feature, i) => (
                        <div key={i} className="bg-gray-800 p-8 rounded-3xl border border-gray-700 hover:border-blue-500/50 transition-all hover:shadow-2xl hover:shadow-blue-500/10 group">
                            <div className="mb-6 p-4 bg-gray-900 rounded-2xl w-fit group-hover:scale-110 transition-transform border border-gray-700">{feature.icon}</div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
          </div>

          {/* TESTIMONIALS */}
          <div className="py-24 bg-gray-800/30">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">Trusted by Students & Professionals</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { name: "Aditi S.", role: "Student, Pune", text: "I found a shared flat near my college in 2 days. The direct chat feature saved me so much time!" },
                        { name: "Rahul M.", role: "IT Professional", text: "Moving to a new city is hard, but RentFlow made it easy. Verified listings gave me peace of mind." },
                        { name: "Suresh K.", role: "Landlord", text: "I manage 5 properties. The dashboard helps me track applications easily. Highly recommended." }
                    ].map((review, i) => (
                        <div key={i} className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                            <div className="flex gap-1 text-yellow-500 mb-4">
                                {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                            </div>
                            <p className="text-gray-300 mb-6 italic">"{review.text}"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold">
                                    {review.name[0]}
                                </div>
                                <div>
                                    <h4 className="font-bold">{review.name}</h4>
                                    <p className="text-xs text-gray-500">{review.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="py-24 bg-gray-900">
            <div className="max-w-3xl mx-auto px-4">
                <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {[
                        { q: "Is RentFlow free to use?", a: "Yes! Tenants can search and apply for free. Landlords get 1 free listing." },
                        { q: "Are the landlords verified?", a: "We perform a basic KYC check on all landlords to ensure safety." },
                        { q: "Can I contact the owner directly?", a: "Yes, once you log in, you can see contact details or chat directly." }
                    ].map((faq, i) => (
                        <div key={i} className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                                <HelpCircle size={20} className="text-blue-500" /> {faq.q}
                            </h3>
                            <p className="text-gray-400 pl-7">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </>
      )}


      {/* 5. CTA SECTION */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 py-20 relative overflow-hidden mt-20">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Ready to find your new place?</h2>
            <div className="flex justify-center">
                {user ? (
                     <Link to="/add-room" className="bg-white text-blue-900 font-bold py-4 px-10 rounded-xl hover:bg-gray-100 transition-colors shadow-2xl">
                        Post a Room Now
                    </Link>
                ) : (
                    <Link to="/login" state={{ mode: 'signup' }} className="bg-white text-blue-900 font-bold py-4 px-10 rounded-xl hover:bg-gray-100 transition-colors shadow-2xl">
                        Get Started for Free
                    </Link>
                )}
            </div>
        </div>
      </div>

    </div>
  );
};

// REUSABLE ROOM CARD COMPONENT
const RoomCardContent = ({ room, isGuest }) => (
    <>
        <div className="h-56 overflow-hidden relative">
            <img 
                src={room.image_url || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"} 
                alt={room.title}
                onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"; }}
                className={`w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ${isGuest ? 'grayscale group-hover:grayscale-0' : ''}`}
            />
            
            {isGuest && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <span className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-xl hover:bg-blue-500 pointer-events-none">
                        <Lock size={16}/> Login to View
                    </span>
                </div>
            )}

            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full font-bold border border-white/10 flex items-center gap-1 text-sm">
                <IndianRupee size={14} /> {room.price}
            </div>
            <div className="absolute bottom-4 left-4">
                <span className="bg-blue-600/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-lg mb-2 inline-block shadow-lg">
                    {room.property_type}
                </span>
            </div>
        </div>
        
        <div className={`p-5 ${isGuest ? 'opacity-70' : ''}`}>
            <h3 className="text-lg font-bold text-white mb-2 truncate">{room.title}</h3>
            <div className="flex items-center text-gray-400 mb-4 text-sm">
                <MapPin size={16} className="mr-2 text-purple-400 shrink-0" />
                <span className="truncate">{room.location}</span>
            </div>
            
            {!isGuest && (
                <div className="pt-4 border-t border-gray-700 flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-500 bg-gray-900 px-2 py-1 rounded-md border border-gray-700">
                        Prefers: <span className="text-gray-300">{room.tenant_preference}</span>
                    </span>
                    <span className="text-blue-400 text-sm font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Details <ArrowRight size={14} />
                    </span>
                </div>
            )}
        </div>
    </>
);

export default Home;