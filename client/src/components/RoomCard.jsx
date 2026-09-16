import { Link } from 'react-router-dom';
import { IndianRupee, Heart, MapPin, ArrowRight, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const RoomCard = ({ room, isGuest, isLiked, onToggleLike, onGuestClick, fluid = false }) => {
    return (
        <motion.div 
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`${fluid ? 'w-full h-full' : 'min-w-[85vw] md:min-w-[350px] lg:min-w-[400px] snap-center'}`}
        >
            <Link 
                to={isGuest ? '#' : `/room/${room.id}`} 
                onClick={isGuest ? onGuestClick : undefined}
                className="group bg-gray-800 rounded-3xl overflow-hidden border border-gray-700 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20 transition-all block cursor-pointer h-full"
            >
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

                    {/* Price Badge */}
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full font-bold border border-white/10 flex items-center gap-1 text-sm">
                        <IndianRupee size={14} /> {room.price}
                    </div>

                    {/* Heart Button */}
                    {!isGuest && (
                        <motion.button 
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onToggleLike(e, room.id);
                            }}
                            className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 transition-all border border-white/10 z-20"
                        >
                            <Heart 
                                size={20} 
                                className={`transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} 
                            />
                        </motion.button>
                    )}

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
            </Link>
        </motion.div>
    );
};

export default RoomCard;
