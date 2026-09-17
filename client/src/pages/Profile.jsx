import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { supabase } from '../supabase';
import { User, Mail, Camera, Save, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('tenant');
  
  const [formData, setFormData] = useState({
      full_name: '',
      bio: '',
      avatar_url: null
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const checkSession = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!mounted) return;
            
            if (!session?.user) {
                navigate('/login');
                return;
            }
            
            setUser(session.user);
            const cachedRole = localStorage.getItem(`role_${session.user.id}`);
            if (cachedRole) setRole(cachedRole);
            
            const res = await api.get(`/api/profiles/${session.user.id}`);
            if (res.data && mounted) {
                setFormData({
                    full_name: res.data.full_name || '',
                    bio: res.data.bio || '',
                    avatar_url: res.data.avatar_url || null
                });
                if (res.data.role) setRole(res.data.role);
            }
        } catch (err) {
            console.error("Session check error:", err);
            if (mounted) navigate('/login');
        } finally {
            if (mounted) setLoading(false);
        }
    };
    
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      if (!session?.user) navigate('/login');
    });

    return () => {
        mounted = false;
        authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    try {
      setUploadingImage(true);
      const file = e.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      setFormData({ ...formData, avatar_url: data.publicUrl });
      toast.success("Avatar uploaded successfully");
    } catch (error) {
      toast.error('Error uploading avatar: ' + error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
        await api.put(`/api/profiles/${user.id}`, formData);
        toast.success("Profile updated successfully!");
    } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile.");
    } finally {
        setUpdating(false);
    }
  };

  if (loading) return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
          <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
      </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8 flex justify-center pb-24">
      <div className="w-full max-w-4xl">
        
        <Link to={role === 'admin' ? '/admin' : `/dashboard/${role === 'landlord' ? 'host' : 'tenant'}`} className="inline-flex items-center text-gray-400 hover:text-white mb-6 md:mb-10 transition-colors font-medium">
            <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
        </Link>

        <div className="bg-gray-900 rounded-3xl overflow-hidden border border-gray-800 shadow-2xl relative">
            {/* Header Banner */}
            <div className="h-40 md:h-48 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative">
                <div className="absolute inset-0 bg-black/20"></div>
            </div>

            <div className="px-6 md:px-12 pb-12 relative">
                <form onSubmit={handleSave} className="space-y-10">
                    
                    {/* Avatar Section (Floating) */}
                    <div className="flex flex-col md:flex-row gap-6 md:items-end -mt-16 md:-mt-20 mb-8 relative z-10">
                        <div className="relative group shrink-0">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border-4 border-gray-900 shadow-2xl bg-gray-800 flex items-center justify-center text-gray-500">
                                {formData.avatar_url ? (
                                    <img src={formData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={64} className="opacity-50" />
                                )}
                            </div>
                          
                            <label className="absolute -bottom-3 -right-3 bg-blue-600 hover:bg-blue-500 p-3 md:p-3.5 rounded-2xl cursor-pointer shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1 group-hover:scale-105 border-4 border-gray-900">
                                {uploadingImage ? <Loader2 size={20} className="animate-spin text-white"/> : <Camera size={20} className="text-white" />}
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleImageUpload} 
                                    disabled={uploadingImage}
                                    className="hidden" 
                                />
                            </label>
                        </div>
                        <div className="flex-1 pb-2">
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Public Profile</h1>
                                {role !== 'tenant' && <ShieldCheck className="text-blue-500" size={24} title="Verified Host" />}
                            </div>
                            <p className="text-gray-400 font-medium">Update your photo and personal details here.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column: Core Identity */}
                        <div className="space-y-6 bg-gray-800/30 p-6 md:p-8 rounded-2xl border border-gray-800">
                            <h3 className="text-lg font-semibold text-gray-300 mb-4 border-b border-gray-700 pb-2">Identity & Contact</h3>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input 
                                        name="full_name"
                                        value={formData.full_name} 
                                        onChange={handleChange} 
                                        placeholder="e.g. Prashant More" 
                                        className="w-full bg-gray-950 border border-gray-700 rounded-xl pl-11 pr-4 py-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-inner" 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Email Address (Read-only)</label>
                                <div className="flex items-center bg-gray-950 border border-gray-800 rounded-xl px-4 py-3.5 text-gray-500 opacity-80 cursor-not-allowed">
                                    <Mail size={18} className="mr-3" />
                                    {user?.email}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Bio / Resume Details */}
                        <div className="space-y-6 bg-gray-800/30 p-6 md:p-8 rounded-2xl border border-gray-800 flex flex-col">
                            <h3 className="text-lg font-semibold text-gray-300 mb-4 border-b border-gray-700 pb-2">
                                {role === 'tenant' ? 'Renter Profile / Bio' : 'Host Bio'}
                            </h3>
                            
                            <div className="flex-1 flex flex-col">
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    {role === 'tenant' 
                                      ? 'Tell landlords about yourself (Occupation, Pets, Lifestyle)'
                                      : 'Tell tenants about yourself (Experience, Management Style)'}
                                </label>
                                <textarea 
                                    name="bio"
                                    value={formData.bio} 
                                    onChange={handleChange} 
                                    placeholder={role === 'tenant' ? "e.g. I am a software engineer looking for a quiet place. I have no pets and don't smoke..." : "e.g. I have been managing properties in Pune for 10 years..."} 
                                    className="w-full flex-1 bg-gray-950 border border-gray-700 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none shadow-inner min-h-[200px]" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-6 border-t border-gray-800 flex justify-end">
                        <button 
                            type="submit" 
                            disabled={updating} 
                            className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3.5 px-10 rounded-xl transition-all shadow-lg shadow-blue-500/25 active:scale-95 flex justify-center items-center gap-2"
                        >
                            {updating ? <Loader2 className="animate-spin" /> : <><Save size={20}/> Save Changes</>}
                        </button>
                    </div>

                </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;