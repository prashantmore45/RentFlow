import { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { supabase } from '../supabase';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { ArrowLeft, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

import RoomCard from '../components/RoomCard';
import { RoomCardSkeleton } from '../components/Skeletons';

// Fix Leaflet's default icon path issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Basic coordinate map for common cities to avoid rate-limiting a free geocoder
const CITY_COORDS = {
    'pune': [18.5204, 73.8567],
    'mumbai': [19.0760, 72.8777],
    'bangalore': [12.9716, 77.5946],
    'delhi': [28.7041, 77.1025],
    'chennai': [13.0827, 80.2707],
    'hyderabad': [17.3850, 78.4867],
    'kolkata': [22.5726, 88.3639],
};

const getCoordinates = (locationString) => {
    const loc = locationString.toLowerCase();
    for (const city in CITY_COORDS) {
        if (loc.includes(city)) {
            // Add slight jitter so markers don't overlap completely
            const jitterLat = (Math.random() - 0.5) * 0.05;
            const jitterLng = (Math.random() - 0.5) * 0.05;
            return [CITY_COORDS[city][0] + jitterLat, CITY_COORDS[city][1] + jitterLng];
        }
    }
    // Default to central India with jitter
    return [20.5937 + (Math.random() - 0.5), 78.9629 + (Math.random() - 0.5)];
};

// Component to dynamically adjust map view based on markers
const MapUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, 12, { animate: true });
        }
    }, [center, map]);
    return null;
};

const MapSearch = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialLoc = queryParams.get('location') || '';
    const initialType = queryParams.get('type') || '';

    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [favorites, setFavorites] = useState([]);
    
    const [searchLoc, setSearchLoc] = useState(initialLoc);
    const [searchType, setSearchType] = useState(initialType);
    
    // Map State
    const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Default India
    const [hoveredRoomId, setHoveredRoomId] = useState(null);

    // Attach coordinates to rooms
    const roomsWithCoords = useMemo(() => {
        return rooms.map(room => ({
            ...room,
            coords: getCoordinates(room.location)
        }));
    }, [rooms]);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUser(session.user);
                fetchFavorites(session.user.id);
            } else {
                toast.error("Please login to use the map search");
                navigate('/login');
            }
        };
        checkUser();
        fetchRooms(initialLoc, initialType);
    }, [navigate, initialLoc, initialType]);

    const fetchRooms = async (loc, type) => {
        setLoading(true);
        try {
            let path = '/api/rooms';
            const params = new URLSearchParams();
            if (loc) params.append('location', loc);
            if (type) params.append('type', type);
            if (params.toString()) path += `?${params.toString()}`;

            const res = await api.get(path);
            setRooms(res.data);

            if (res.data.length > 0) {
                setMapCenter(getCoordinates(loc || res.data[0].location));
            } else if (loc) {
                setMapCenter(getCoordinates(loc));
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to load search results");
        } finally {
            setLoading(false);
        }
    };

    const fetchFavorites = async (userId) => {
        try {
            const res = await api.get(`/api/favorites/${userId}`);
            setFavorites(res.data.map(f => f.room_id));
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // Update URL
        navigate(`/map-search?location=${encodeURIComponent(searchLoc)}&type=${encodeURIComponent(searchType)}`);
        fetchRooms(searchLoc, searchType);
    };

    const toggleFavorite = async (e, roomId) => {
        e.preventDefault(); 
        e.stopPropagation(); 
        if (!user) return navigate('/login');

        if (favorites.includes(roomId)) {
            setFavorites(prev => prev.filter(id => id !== roomId));
        } else {
            setFavorites(prev => [...prev, roomId]);
            toast.success('Added to favorites!');
        }

        try {
            await api.post(`/api/favorites/toggle/${roomId}`, { user_id: user.id });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white overflow-hidden pt-20 pb-4 px-2 md:px-0">
            {/* LEFT PANEL - LISTINGS */}
            <div className="w-full md:w-[50%] lg:w-[45%] h-full flex flex-col relative z-10 shadow-2xl shadow-black">
                
                {/* Search Header */}
                <div className="p-4 bg-gray-800 border-b border-gray-700 shadow-md">
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors">
                        <ArrowLeft size={16} /> Back to Home
                    </button>
                    
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                        <input 
                            type="text" 
                            placeholder="Location (e.g. Pune)"
                            value={searchLoc}
                            onChange={(e) => setSearchLoc(e.target.value)}
                            className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <select 
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                            className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="">Any Type</option>
                            <option value="1 BHK">1 BHK</option>
                            <option value="2 BHK">2 BHK</option>
                            <option value="Single Room">Single Room</option>
                            <option value="Shared">Shared / PG</option>
                        </select>
                        <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2 rounded-xl transition-colors">
                            Search
                        </button>
                    </form>
                    <p className="mt-3 text-sm text-gray-400 font-medium">
                        {loading ? 'Searching...' : `${rooms.length} homes found`}
                    </p>
                </div>

                {/* Listings Scroll Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
                    {loading ? (
                        <>
                            <RoomCardSkeleton />
                            <RoomCardSkeleton />
                            <RoomCardSkeleton />
                        </>
                    ) : rooms.length === 0 ? (
                        <div className="text-center py-20">
                            <h3 className="text-xl font-bold text-gray-400 mb-2">No rooms found</h3>
                            <p className="text-gray-500">Try adjusting your search filters.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
                            {roomsWithCoords.map(room => (
                                <div 
                                    key={room.id}
                                    onMouseEnter={() => setHoveredRoomId(room.id)}
                                    onMouseLeave={() => setHoveredRoomId(null)}
                                >
                                    <RoomCard 
                                        room={room}
                                        isGuest={!user}
                                        isLiked={favorites.includes(room.id)}
                                        onToggleLike={toggleFavorite}
                                        onGuestClick={() => navigate('/login')}
                                        fluid={true}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT PANEL - MAP */}
            <div className="hidden md:block flex-1 h-full relative bg-gray-800">
                <MapContainer 
                    center={mapCenter} 
                    zoom={12} 
                    className="w-full h-full"
                    zoomControl={false}
                >
                    <MapUpdater center={mapCenter} />
                    
                    {/* Standard OSM Tiles with CSS Invert for Dark Mode */}
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        className="map-tiles"
                    />

                    {roomsWithCoords.map(room => (
                        <Marker 
                            key={room.id} 
                            position={room.coords}
                            opacity={hoveredRoomId === room.id ? 1 : 0.6}
                            zIndexOffset={hoveredRoomId === room.id ? 1000 : 0}
                        >
                            <Popup className="custom-popup">
                                <div className="w-48">
                                    <img src={room.image_url} alt={room.title} className="w-full h-24 object-cover rounded-t-lg mb-2" />
                                    <p className="font-bold text-gray-900 truncate px-2">{room.title}</p>
                                    <p className="text-blue-600 font-bold px-2 pb-2">₹{room.price}</p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
            
            {/* Custom Styles for Leaflet Overrides */}
            <style>{`
                .leaflet-container { font-family: 'Inter', sans-serif; }
                .leaflet-popup-content-wrapper { padding: 0; overflow: hidden; border-radius: 0.75rem; }
                .leaflet-popup-content { margin: 0; width: auto !important; }
                .map-tiles { filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%); }
            `}</style>
        </div>
    );
};

export default MapSearch;
