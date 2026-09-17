import { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, User, Loader2, ArrowRight, AlertCircle, Eye, EyeOff, Home } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isSignUp, setIsSignUp] = useState(location.state?.mode === 'signup');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'tenant' // Default role
  });

  const toggleMode = () => {
      setIsSignUp(!isSignUp);
      setIsForgotPassword(false);
      setError('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      setError("Please enter your email address first.");
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      if (error) throw error;
      toast.success('Password reset link sent to your email!');
      setIsForgotPassword(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: { data: { name: formData.fullName, role: formData.role } },
        });
        if (error) throw error;
        
        // Ensure role is explicitly set in profiles just in case trigger misses it
        if (data?.user) {
           await supabase.from('profiles').update({ role: formData.role }).eq('id', data.user.id);
        }
        
        toast.success('Registration Successful! Check your email for verification.');
        setIsSignUp(false);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        
        // Smart Role-Based Redirection
        try {
            const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
            const userRole = profile?.role || 'tenant';
            
            // Cache role to speed up subsequent renders
            localStorage.setItem(`role_${data.user.id}`, userRole);
            
            if (userRole === 'admin') {
                navigate('/admin');
            } else if (userRole === 'landlord') {
                navigate('/dashboard/host');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error("Failed to fetch role, defaulting to home:", err);
            navigate('/');
        }
      }
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

        {/* Auth Card */}
        <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 p-8 rounded-3xl shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">
                {isForgotPassword ? 'Reset Password' : (isSignUp ? 'Create an Account' : 'Welcome Back')}
            </h2>
            <p className="text-gray-400 text-center mb-6 text-sm">
                {isForgotPassword ? 'Enter your email to receive a password reset link.' : (isSignUp ? 'Join thousands of users finding their home.' : 'Enter your details to access your account.')}
            </p>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl mb-6 flex items-start gap-3 text-sm">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    {error}
                </div>
            )}

            <form onSubmit={isForgotPassword ? handleForgotPassword : handleAuth} className="space-y-4">
                
                {/* Role Selector (Only for Sign Up) */}
                {isSignUp && !isForgotPassword && (
                    <div className="flex gap-4 mb-4">
                        <div 
                            onClick={() => handleRoleSelect('tenant')}
                            className={`flex-1 cursor-pointer rounded-xl p-3 border-2 transition-all flex flex-col items-center justify-center gap-2 ${formData.role === 'tenant' ? 'border-purple-500 bg-purple-500/10 text-white' : 'border-gray-700 bg-gray-900/50 text-gray-400 hover:border-gray-500'}`}
                        >
                            <User size={24} className={formData.role === 'tenant' ? 'text-purple-400' : ''}/>
                            <span className="text-sm font-bold">Tenant</span>
                        </div>
                        <div 
                            onClick={() => handleRoleSelect('landlord')}
                            className={`flex-1 cursor-pointer rounded-xl p-3 border-2 transition-all flex flex-col items-center justify-center gap-2 ${formData.role === 'landlord' ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-gray-700 bg-gray-900/50 text-gray-400 hover:border-gray-500'}`}
                        >
                            <Home size={24} className={formData.role === 'landlord' ? 'text-blue-400' : ''}/>
                            <span className="text-sm font-bold">Landlord</span>
                        </div>
                    </div>
                )}

                {/* Full Name (Only for Sign Up) */}
                {isSignUp && !isForgotPassword && (
                    <div className="relative group">
                        <User className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-purple-400 transition-colors" size={20} />
                        <input 
                            name="fullName"
                            type="text" 
                            placeholder="Full Name"
                            required={isSignUp}
                            onChange={handleChange}
                            className="w-full bg-gray-900/60 border border-gray-600 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder-gray-500"
                        />
                    </div>
                )}

                <div className="relative group">
                    <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-400 transition-colors" size={20} />
                    <input 
                        name="email"
                        type="email" 
                        placeholder="Email Address"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-gray-900/60 border border-gray-600 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-500"
                    />
                </div>

                {!isForgotPassword && (
                    <div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-400 transition-colors" size={20} />
                            <input 
                                name="password"
                                type={showPassword ? "text" : "password"} 
                                placeholder="Password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-gray-900/60 border border-gray-600 rounded-xl py-3 pl-12 pr-12 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-500"
                            />
                            {/* Toggle Password Visibility Button */}
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-3.5 text-gray-400 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        
                        {!isSignUp && (
                            <div className="text-right mt-2">
                                <button 
                                    type="button"
                                    onClick={() => { setIsForgotPassword(true); setError(''); }}
                                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 mt-4"
                >
                    {loading ? <Loader2 className="animate-spin" /> : (
                        <>
                            {isForgotPassword ? 'Send Reset Link' : (isSignUp ? 'Sign Up' : 'Sign In')} <ArrowRight size={20} />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-6 text-center text-sm">
                {isForgotPassword ? (
                    <button 
                        onClick={() => setIsForgotPassword(false)}
                        className="text-blue-400 hover:text-blue-300 font-bold hover:underline transition-colors"
                    >
                        Back to Login
                    </button>
                ) : (
                    <>
                        <span className="text-gray-400">
                            {isSignUp ? "Already have an account?" : "Don't have an account?"}
                        </span>
                        <button 
                            onClick={toggleMode}
                            className="ml-2 text-blue-400 hover:text-blue-300 font-bold hover:underline transition-colors"
                        >
                            {isSignUp ? 'Log In' : 'Sign Up'}
                        </button>
                    </>
                )}
            </div>
            <p className="text-center text-gray-500 text-xs mt-8">
              © {new Date().getFullYear()} RentFlow. Secure Authentication by Supabase.
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;