import { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from '../supabase';
import { User, Mail, Camera, Save, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [user, setUser] = useState(null);
  
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUser(user);

      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${apiUrl}/api/profiles/${user.id}`);
        
        if (res.data) {
            setFullName(res.data.full_name || '');
            setBio(res.data.bio || '');
            setAvatarUrl(res.data.avatar_url || null);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    getProfile();
  }, []);

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
      setAvatarUrl(data.publicUrl);
      
    } catch (error) {
      alert('Error uploading avatar: ' + error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        await axios.put(`${apiUrl}/api/profiles/${user.id}`, {
            full_name: fullName,
            bio: bio,
            avatar_url: avatarUrl
        });
        alert("Profile updated successfully!");
    } catch (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update profile.");
    } finally {
        setUpdating(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8 flex justify-center">
      <div className="w-full max-w-2xl">
        
        <Link to="/dashboard" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
        </Link>

        <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600 to-purple-600 opacity-20"></div>

            <div className="relative z-10">
                <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>

                <form onSubmit={handleSave} className="space-y-8">
                    
                    <div className="flex flex-col items-center">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-800 shadow-xl bg-gray-700">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <User size={48} />
                                    </div>
                                )}
                            </div>
                          
                            <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-500 p-2 rounded-full cursor-pointer shadow-lg transition-transform hover:scale-110">
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
                        <p className="text-sm text-gray-400 mt-4">Click camera to upload photo</p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
                            <input 
                                value={fullName} 
                                onChange={(e) => setFullName(e.target.value)} 
                                placeholder="e.g. Prashant More" 
                                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Bio / About Me</label>
                            <textarea 
                                value={bio} 
                                onChange={(e) => setBio(e.target.value)} 
                                placeholder="Tell us about yourself (e.g. Student at XYZ College, Vegetarian)" 
                                rows="4"
                                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none" 
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Email (Cannot be changed)</label>
                            <div className="flex items-center bg-gray-900/50 border border-gray-700/50 rounded-xl p-4 text-gray-500">
                                <Mail size={18} className="mr-3" />
                                {user?.email}
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={updating} 
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex justify-center items-center gap-2"
                    >
                        {updating ? <Loader2 className="animate-spin" /> : <><Save size={20}/> Save Profile</>}
                    </button>

                </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;