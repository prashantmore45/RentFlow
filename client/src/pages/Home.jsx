import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

import { motion } from 'framer-motion';

import Hero from '../components/home/Hero';
import { Stats, HowItWorks, Features, Testimonials, FAQ, CTA } from '../components/home/MarketingSections';
import RoomCard from '../components/RoomCard';
import { RoomCardSkeleton } from '../components/Skeletons';

const Home = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [favorites, setFavorites] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  
  // Search state passed to Hero
  const [isSearching, setIsSearching] = useState(false);

  // Define Categories for rows
  const categories = ["1 BHK", "2 BHK", "Single Room", "Shared", "Villa"];

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user || null;
      setUser(currentUser);
      
      if (currentUser) {
        fetchFavorites(currentUser.id);
      }
    };
    checkUser();
    fetchRooms();
  }, []);

  const fetchRooms = async (location = '', type = '') => {
    setLoading(true);
    if (location || type) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
    
    try {
      let path = '/api/rooms';
      const params = new URLSearchParams();
      if (location) params.append('location', location);
      if (type) params.append('type', type);
      if (params.toString()) path += `?${params.toString()}`;

      const res = await api.get(path);
      setRooms(res.data.reverse()); 
    } catch (err) {
      console.error("Error fetching rooms:", err);
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async (userId) => {
    try {
      const res = await api.get(`/api/favorites/${userId}`);
      const roomIds = res.data.map(fav => fav.room_id);
      setFavorites(roomIds); 
    } catch (err) {
      console.error("Error fetching favorites:", err);
    }
  };

  const toggleFavorite = async (e, roomId) => {
    e.preventDefault(); 
    e.stopPropagation(); 

    if (!user) {
        navigate('/login');
        return;
    }

    if (favorites.includes(roomId)) {
        setFavorites(prev => prev.filter(id => id !== roomId));
    } else {
        setFavorites(prev => [...prev, roomId]);
        toast.success('Added to favorites!');
    }

    try {
        await api.post(`/api/favorites/toggle/${roomId}`, { user_id: user.id });
        await fetchFavorites(user.id);
    } catch (err) {
        console.error("Error toggling favorite:", err);
        toast.error('Failed to update favorites');
        await fetchFavorites(user.id);
    }
  };

  const handleGuestClick = (e) => {
      e.preventDefault();
      navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans selection:bg-purple-500 selection:text-white pb-20">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* 1. HERO SECTION */}
      <Hero user={user} onSearch={fetchRooms} />

      {/* 2. STATS (GUEST ONLY) */}
      {!user && <Stats />}

      {/* 3. LISTINGS (The Product) */}
      <div className="max-w-[95rem] mx-auto px-4 py-16">
        {loading ? (
           <div className="flex gap-6 overflow-x-hidden pb-8 px-2">
               {[1, 2, 3, 4].map(i => <RoomCardSkeleton key={i} />)}
           </div>
        ) : (
          <>
            {!user ? (
               // GUEST VIEW
               <div>
                  <div className="flex justify-between items-end mb-8 px-2">
                    <div>
                        <h2 className="font-heading text-3xl md:text-5xl font-bold mb-2">Fresh on the Market</h2>
                        <p className="text-gray-400">Join to see full details and apply.</p>
                    </div>
                    <Link to="/login" className="hidden md:flex items-center gap-2 text-blue-400 font-semibold hover:text-blue-300 transition-colors">
                        Login to View All <ArrowRight size={20} />
                    </Link>
                  </div>
                  
                  <div className="flex gap-6 overflow-x-auto pb-8 snap-x mandatory scrollbar-hide px-2">
                    {rooms.slice(0, 4).map(room => (
                      <RoomCard 
                        key={room.id}
                        room={room} 
                        isGuest={true} 
                        onGuestClick={handleGuestClick}
                      />
                    ))}
                  </div>
               </div>
            ) : (
               // LOGGED IN USER
               <div className="space-y-16">
                  {isSearching ? (
                      <motion.div 
                          initial="hidden" 
                          animate="visible" 
                          variants={{
                              hidden: { opacity: 0 },
                              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                          }}
                      >
                          <h2 className="font-heading text-2xl font-bold mb-6 px-2">Search Results</h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                              {rooms.map(room => (
                                  <motion.div key={room.id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                                      <RoomCard 
                                        room={room}
                                        isGuest={false}
                                        isLiked={favorites.includes(room.id)}
                                        onToggleLike={toggleFavorite}
                                      />
                                  </motion.div>
                              ))}
                          </div>
                      </motion.div>
                  ) : (
                      categories.map((category) => {
                          const categoryRooms = rooms.filter(r => r.property_type === category || (category === 'Shared' && (r.property_type || '').includes('Shared')));
                          if (categoryRooms.length === 0) return null;

                          return (
                              <div key={category}>
                                  <div className="flex items-center gap-3 mb-6 px-2">
                                      <h2 className="font-heading text-2xl font-bold text-white">{category}s</h2>
                                      <span className="text-sm text-gray-500 font-medium bg-gray-800 px-2 py-1 rounded-md">{categoryRooms.length}</span>
                                  </div>
                                  
                                  <motion.div 
                                      initial="hidden"
                                      whileInView="visible"
                                      viewport={{ once: true, margin: "-50px" }}
                                      variants={{
                                          hidden: { opacity: 0 },
                                          visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                                      }}
                                      className="flex gap-6 overflow-x-auto pb-4 snap-x mandatory scrollbar-hide px-2"
                                  >
                                      {categoryRooms.map(room => (
                                          <motion.div key={room.id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                                              <RoomCard 
                                                room={room}
                                                isGuest={false}
                                                isLiked={favorites.includes(room.id)}
                                                onToggleLike={toggleFavorite}
                                              />
                                          </motion.div>
                                      ))}
                                  </motion.div>
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
          <HowItWorks />
          <Features />
          <Testimonials />
          <FAQ />
        </>
      )}

      {/* 5. CTA SECTION */}
      <CTA user={user} />

    </div>
  );
};

export default Home;