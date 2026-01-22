import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { supabase } from '../supabase';
import { 
  MapPin, IndianRupee, User, ArrowLeft, Send, ShieldCheck, 
  Star, MessageCircle, Calendar, CheckCircle 
} from 'lucide-react'; 

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Data States
  const [room, setRoom] = useState(null);
  const [landlord, setLandlord] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  
  // UI States
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [applying, setApplying] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  // Review Form States
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      try {
        // Fetch Room Data
        const roomRes = await axios.get(`${apiUrl}/api/rooms/${id}`);
        setRoom(roomRes.data);

        // Fetch Landlord Profile
        const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', roomRes.data.owner_id)
            .single();
        if (profileData) setLandlord(profileData);

        // Fetch Reviews
        const reviewsRes = await axios.get(`${apiUrl}/api/reviews/${id}`);
        setReviews(reviewsRes.data);
        
        // Calculate Average Rating
        if (reviewsRes.data.length > 0) {
            const total = reviewsRes.data.reduce((acc, r) => acc + r.rating, 0);
            setAverageRating((total / reviewsRes.data.length).toFixed(1));
        }

      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [id]);

  const handleApply = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    const message = prompt("Write a short message to the landlord:");
    if (!message) return; 

    setApplying(true);
    try {
      await axios.post(`${apiUrl}/api/applications`, {
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

  const handleSubmitReview = async (e) => {
      e.preventDefault();
      if (!currentUser) return alert("Please login to review");
      
      setSubmittingReview(true);
      try {
          // Post to Backend
          const res = await axios.post(`${apiUrl}/api/reviews`, {
              room_id: room.id,
              user_id: currentUser.id,
              rating: newRating,
              comment: newComment
          });

          // Update UI
          const newReviewObj = {
              ...res.data,
              profiles: { full_name: currentUser.user_metadata?.name || 'You' } 
          };
          
          setReviews([newReviewObj, ...reviews]);
          setNewComment('');
          setNewRating(5);
          alert("Review Posted!");
      } catch (err) {
          console.error(err);
          alert("Failed to post review.");
      } finally {
          setSubmittingReview(false);
      }
  };

  if (loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;
  if (!room) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Room not found</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      
      {/* HERO IMAGE BACKGROUND */}
      <div className="relative h-[50vh] w-full">
          <img 
            src={room.image_url || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"} 
            className="w-full h-full object-cover"
            alt="Room Cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
          
          <Link to="/" className="absolute top-8 left-8 bg-black/40 backdrop-blur-md p-3 rounded-full hover:bg-black/60 transition-all text-white border border-white/10">
            <ArrowLeft size={24} />
          </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: DETAILS & REVIEWS */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* Title Card */}
            <div className="bg-gray-800/80 backdrop-blur-md rounded-3xl p-8 border border-gray-700 shadow-2xl">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="flex gap-2 mb-2">
                             <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">{room.property_type}</span>
                             {averageRating > 0 && (
                                 <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-yellow-500/30">
                                     <Star size={12} fill="currentColor" /> {averageRating} ({reviews.length} reviews)
                                 </span>
                             )}
                        </div>
                        <h1 className="text-4xl font-bold mb-2">{room.title}</h1>
                        <div className="flex items-center text-gray-400">
                            <MapPin size={18} className="mr-2 text-blue-400" /> {room.location}
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-700 my-6 pt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-900/50 p-3 rounded-xl border border-gray-700 text-center">
                        <User className="mx-auto text-purple-400 mb-1" size={20} />
                        <p className="text-xs text-gray-500 uppercase">Preference</p>
                        <p className="font-bold">{room.tenant_preference}</p>
                    </div>
                    <div className="bg-gray-900/50 p-3 rounded-xl border border-gray-700 text-center">
                         <ShieldCheck className="mx-auto text-green-400 mb-1" size={20} />
                         <p className="text-xs text-gray-500 uppercase">Verified</p>
                         <p className="font-bold">Yes</p>
                    </div>
                    <div className="bg-gray-900/50 p-3 rounded-xl border border-gray-700 text-center">
                         <Calendar className="mx-auto text-blue-400 mb-1" size={20} />
                         <p className="text-xs text-gray-500 uppercase">Move In</p>
                         <p className="font-bold">Immediate</p>
                    </div>
                    <div className="bg-gray-900/50 p-3 rounded-xl border border-gray-700 text-center">
                         <IndianRupee className="mx-auto text-yellow-400 mb-1" size={20} />
                         <p className="text-xs text-gray-500 uppercase">Deposit</p>
                         <p className="font-bold">₹{room.price * 2}</p>
                    </div>
                </div>

                <h3 className="text-xl font-bold mb-3">About this place</h3>
                <p className="text-gray-300 leading-relaxed">
                    Located in the heart of {room.location}, this property offers a comfortable living space for {room.tenant_preference}s. 
                    It features modern amenities, 24/7 water supply, and is close to major transport hubs.
                </p>
            </div>

            {/* REVIEWS SECTION */}
            <div className="bg-gray-800/80 backdrop-blur-md rounded-3xl p-8 border border-gray-700 shadow-xl">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Star className="text-yellow-400" fill="currentColor" /> Reviews ({reviews.length})
                </h3>

                {/* Add Review Form */}
                {currentUser && currentUser.id !== room.owner_id && (
                    <form onSubmit={handleSubmitReview} className="mb-8 bg-gray-900/50 p-4 rounded-2xl border border-gray-700">
                        <h4 className="font-bold mb-3">Leave a Review</h4>
                        <div className="flex gap-2 mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} type="button" onClick={() => setNewRating(star)} className="focus:outline-none">
                                    <Star size={24} className={star <= newRating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"} />
                                </button>
                            ))}
                        </div>
                        <textarea 
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Share your experience..."
                            className="w-full bg-gray-800 border border-gray-600 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none mb-3"
                            rows="3"
                            required
                        ></textarea>
                        <button type="submit" disabled={submittingReview} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-bold transition-colors">
                            {submittingReview ? 'Posting...' : 'Post Review'}
                        </button>
                    </form>
                )}

                {/* Reviews List */}
                <div className="space-y-6">
                    {reviews.length === 0 ? (
                        <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
                    ) : (
                        reviews.map((rev) => (
                            <div key={rev.id} className="border-b border-gray-700 pb-6 last:border-0">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center font-bold text-white">
                                            {/* Fallback if profiles is null (e.g. creating review immediately) */}
                                            {rev.profiles?.full_name ? rev.profiles.full_name[0] : 'U'}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm">{rev.profiles?.full_name || 'User'}</h4>
                                            <p className="text-xs text-gray-500">{new Date(rev.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex text-yellow-400">
                                        {[...Array(rev.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                    </div>
                                </div>
                                <p className="text-gray-300 text-sm pl-12">{rev.comment}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>

        {/* RIGHT COLUMN: ACTION CARD (Sticky) */}
        <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
                
                {/* Price & Action Card */}
                <div className="bg-gray-800/80 backdrop-blur-md rounded-3xl p-6 border border-gray-700 shadow-2xl">
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <p className="text-gray-400 text-sm">Monthly Rent</p>
                            <h3 className="text-3xl font-bold text-white flex items-center">
                                <IndianRupee size={24} /> {room.price}
                            </h3>
                        </div>
                        <div className="text-right">
                             <span className="block text-xs text-gray-400">No Brokerage</span>
                             <span className="block text-xs text-green-400">Available Now</span>
                        </div>
                    </div>

                    {currentUser && currentUser.id === room.owner_id ? (
                        <div className="p-4 bg-yellow-500/10 text-yellow-500 rounded-xl text-center border border-yellow-500/20 font-bold">
                            You own this property
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <button 
                                onClick={handleApply}
                                disabled={applying}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-purple-900/20 flex justify-center items-center gap-2"
                            >
                                {applying ? 'Sending...' : <><Send size={18}/> Apply Now</>}
                            </button>
                            <button 
                                onClick={() => navigate(`/chat/${room.id}/${room.owner_id}`)}
                                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2 border border-gray-600"
                            >
                                <MessageCircle size={18}/> Chat with Landlord
                            </button>
                        </div>
                    )}
                </div>

                {/* Landlord Card */}
                <div className="bg-gray-800/80 backdrop-blur-md rounded-3xl p-6 border border-gray-700 shadow-xl">
                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Listed by</h3>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-700 border-2 border-green-500">
                             {landlord?.avatar_url ? (
                                 <img src={landlord.avatar_url} alt="Landlord" className="w-full h-full object-cover" />
                             ) : (
                                 <div className="w-full h-full flex items-center justify-center"><User size={24}/></div>
                             )}
                        </div>
                        <div>
                            <h4 className="font-bold text-white">{landlord?.full_name || "Room Owner"}</h4>
                            <div className="flex items-center text-xs text-green-400 gap-1">
                                <CheckCircle size={12} /> Identity Verified
                            </div>
                        </div>
                    </div>
                    {landlord?.bio && (
                         <p className="text-sm text-gray-400 italic mb-4">"{landlord.bio}"</p>
                    )}
                    <div className="pt-4 border-t border-gray-700 text-sm text-gray-300">
                        Response Rate: <span className="text-white font-bold">98%</span><br/>
                        Typically replies within 2 hours
                    </div>
                </div>

            </div>
        </div>

      </div>
    </div>
  );
};

export default RoomDetails;