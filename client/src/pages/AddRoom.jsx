import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { Home, Camera, Loader2, X, Image as ImageIcon } from 'lucide-react';

const AddRoom = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [formData, setFormData] = useState({
    title: '', location: '', price: '', property_type: '', tenant_preference: '', contact_number: ''
  });

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {

      if (!file.type.startsWith('image/')) {
        alert("Please upload an image file (JPG, PNG).");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB.");
        return;
      }
      
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return; 
    
    setLoading(true);

    try {
      let finalImageUrl = null;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('room-images') 
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('room-images')
          .getPublicUrl(fileName);
          
        finalImageUrl = data.publicUrl;
      }

      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/rooms`, {
        ...formData,
        owner_id: user.id,
        image_url: finalImageUrl 
      });
      
      alert("Success! Room posted.");
      navigate('/');
    } catch (err) {
      console.error(err);
      alert("Failed to post room: " + (err.message || "Unknown error"));
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
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Property Image</label>
            
            {!previewUrl ? (

              <div className="relative border-2 border-dashed border-gray-500 rounded-2xl p-8 hover:border-purple-500 hover:bg-white/5 transition-all text-center group cursor-pointer bg-gray-800/50">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center">
                  <div className="p-4 bg-gray-700/50 rounded-full group-hover:bg-purple-500/20 mb-3 transition-colors">
                    <Camera size={32} className="text-gray-400 group-hover:text-purple-400" />
                  </div>
                  <p className="font-semibold text-gray-300">Click to upload or take photo</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG (Max 5MB)</p>
                </div>
              </div>
            ) : (

              <div className="relative rounded-2xl overflow-hidden border border-gray-600 group">
                <img src={previewUrl} alt="Preview" className="w-full h-64 object-cover" />
                <button 
                  type="button"
                  onClick={removeImage}
                  className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>

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
                    <option value="Single Room" className="bg-gray-800">Single Room/Private Room</option>
                    <option value="Shared" className="bg-gray-800">Shared / PG</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tenant Preference</label>
                <select name="tenant_preference" onChange={handleChange} required className="w-full bg-gray-800/50 border border-gray-600 rounded-xl p-4 focus:ring-2 focus:ring-purple-500 outline-none appearance-none">
                    <option value="" className="bg-gray-800">Who can stay?</option>
                    <option value="Any" className="bg-gray-800">Anyone</option>
                    <option value="Working" className="bg-gray-800">Working Professionals</option>
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

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg transform hover:scale-[1.02] flex justify-center items-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" /> : 'Publish Listing'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRoom;