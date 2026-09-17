import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { Lock, Loader2, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const UpdatePassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Supabase will automatically parse the #access_token from the URL and establish a session.
    // If there is no session, we shouldn't be on this page.
    const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            toast.error("Invalid or expired password reset link.");
            navigate('/login');
        }
    };
    checkSession();
  }, [navigate]);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
    }
    
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      
      toast.success('Password updated successfully!');
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gray-900 bg-cover bg-center px-4"
      style={{
        backgroundImage: `
          linear-gradient(rgba(17, 24, 39, 0.8), rgba(17, 24, 39, 0.8)), 
          url('https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')
        `
      }}
    >
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 p-8 rounded-3xl shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">
                Set New Password
            </h2>
            <p className="text-gray-400 text-center mb-6 text-sm">
                Please enter your new password below.
            </p>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl mb-6 flex items-start gap-3 text-sm">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    {error}
                </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="relative group">
                    <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-400 transition-colors" size={20} />
                    <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="New Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-gray-900/60 border border-gray-600 rounded-xl py-3 pl-12 pr-12 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-500"
                    />
                    <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-3.5 text-gray-400 hover:text-white transition-colors"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 mt-4"
                >
                    {loading ? <Loader2 className="animate-spin" /> : (
                        <>
                            Update Password <ArrowRight size={20} />
                        </>
                    )}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
