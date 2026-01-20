import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabase';
import { Home, Loader2, Save } from 'lucide-react';

const EditRoom = () => {
  const { id } = useParams(); // Get room ID from URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [formData, setFormData] = useState({
    title: '', location: '', price: '', property_type: '', tenant_preference: '', contact_number: ''
  });

  // 1. Fetch User & Room Details
  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/login'); return; }

      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${apiUrl}/api/rooms/${id}`);
        
        // Security Check: Is this MY room?
        if (res.data.owner_id !== user.id) {
          alert("You are not authorized to edit this room.");
          navigate('/dashboard');
          return;
        }

        // Pre-fill form
        setFormData({
            title: res.data.title,
            location: res.data.location,
            price: res.data.price,
            property_type: res.data.property_type,
            tenant_preference: res.data.tenant_preference,
            contact_number: res.data.contact_number
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [id, navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // 2. Handle Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.put(`${apiUrl}/api/rooms/${id}`, formData);
      
      alert("Room updated successfully!");
      navigate('/dashboard');
    } catch (err) {
        console.error(err);
        alert("Failed to update room.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex justify-center">
      <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-3xl border border-gray-700">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Home className="text-blue-500"/> Edit Property
        </h2>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="text-gray-400 text-sm">Title</label>
            <input name="title" value={formData.title} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 outline-none focus:border-blue-500" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
                <label className="text-gray-400 text-sm">Rent (₹)</label>
                <input name="price" type="number" value={formData.price} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 outline-none" />
            </div>
            <div>
                <label className="text-gray-400 text-sm">Location</label>
                <input name="location" value={formData.location} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 outline-none" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
             <select name="property_type" value={formData.property_type} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 outline-none">
                <option value="1 BHK">1 BHK</option>
                <option value="2 BHK">2 BHK</option>
                <option value="Single Room">Single Room</option>
                <option value="Shared">Shared / PG</option>
            </select>
             <select name="tenant_preference" value={formData.tenant_preference} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 outline-none">
                <option value="Any">Any</option>
                <option value="Bachelor">Bachelor</option>
                <option value="Family">Family</option>
                <option value="Girls">Girls Only</option>
            </select>
          </div>

          <div>
            <label className="text-gray-400 text-sm">Contact</label>
            <input name="contact_number" value={formData.contact_number} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 outline-none" />
          </div>

          <div className="flex gap-4">
             <button type="button" onClick={() => navigate('/dashboard')} className="w-1/3 bg-gray-700 hover:bg-gray-600 py-3 rounded-xl font-bold">Cancel</button>
             <button type="submit" disabled={updating} className="w-2/3 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2">
                {updating ? <Loader2 className="animate-spin" /> : <><Save size={18}/> Save Changes</>}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRoom;