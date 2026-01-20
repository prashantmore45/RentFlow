import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase'; 
import { Building2, MapPin, Phone, IndianRupee, Home } from 'lucide-react';

const AddRoom = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("You must be logged in to post a room!");
        navigate('/login'); 
      } else {
        setUser(user);
      }
    };
    checkUser();
  }, [navigate]);

  const [formData, setFormData] = useState({
    title: '', location: '', price: '', property_type: '', tenant_preference: '', contact_number: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return; 
    
    setLoading(true);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/rooms`, {
        ...formData,
        owner_id: user.id 
      });
      
      alert("Success! Room posted.");
      navigate('/');
    } catch (err) {
      console.error(err);
      alert("Failed to post room.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Checking permission...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-6">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl shadow-2xl w-full max-w-2xl text-white">
        
        <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-purple-600 rounded-xl">
                <Home size={32} />
            </div>
            <div>
                <h2 className="text-3xl font-bold">List Your Property</h2>
                <p className="text-gray-300">Posting as: <span className="text-blue-400">{user.email}</span></p>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Property Title</label>
            <input name="title" onChange={handleChange} required placeholder="e.g. Spacious Master Bedroom" className="w-full bg-gray-800/50 border border-gray-600 rounded-xl p-4 focus:ring-2 focus:ring-purple-500 outline-none" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-2">Monthly Rent</label>
                <input name="price" type="number" onChange={handleChange} required placeholder="15000" className="w-full bg-gray-800/50 border border-gray-600 rounded-xl p-4 focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>

            <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                <input name="location" onChange={handleChange} required placeholder="Pune, Kothrud" className="w-full bg-gray-800/50 border border-gray-600 rounded-xl p-4 focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Property Type</label>
                <select name="property_type" onChange={handleChange} required className="w-full bg-gray-800/50 border border-gray-600 rounded-xl p-4 focus:ring-2 focus:ring-purple-500 outline-none appearance-none">
                    <option value="" className="bg-gray-800">Select Type</option>
                    <option value="1 BHK" className="bg-gray-800">1 BHK</option>
                    <option value="2 BHK" className="bg-gray-800">2 BHK</option>
                    <option value="Single Room" className="bg-gray-800">Single Room</option>
                    <option value="Shared" className="bg-gray-800">Shared / PG</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tenant Preference</label>
                <select name="tenant_preference" onChange={handleChange} required className="w-full bg-gray-800/50 border border-gray-600 rounded-xl p-4 focus:ring-2 focus:ring-purple-500 outline-none appearance-none">
                    <option value="" className="bg-gray-800">Who can stay?</option>
                    <option value="Any" className="bg-gray-800">Anyone</option>
                    <option value="Bachelor" className="bg-gray-800">Bachelor Only</option>
                    <option value="Family" className="bg-gray-800">Family Only</option>
                    <option value="Girls" className="bg-gray-800">Girls Only</option>
                </select>
            </div>
          </div>

          <div className="relative">
             <label className="block text-sm font-medium text-gray-300 mb-2">Contact Number</label>
             <input name="contact_number" onChange={handleChange} required placeholder="+91 98765 43210" className="w-full bg-gray-800/50 border border-gray-600 rounded-xl p-4 focus:ring-2 focus:ring-purple-500 outline-none" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg transform hover:scale-[1.02] disabled:opacity-50">
            {loading ? 'Posting...' : 'Publish Listing'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRoom;