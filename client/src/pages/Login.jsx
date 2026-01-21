import { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, User, Loader2, ArrowRight, AlertCircle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isSignUp, setIsSignUp] = useState(location.state?.mode === 'signup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });

  const toggleMode = () => {
      setIsSignUp(!isSignUp);
      setError('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: { data: { name: formData.fullName } },
        });
        if (error) throw error;
        alert('Registration Successful! Check your email for verification.');
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        navigate('/');
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
                {isSignUp ? 'Create an Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-400 text-center mb-6">
                {isSignUp ? 'Join thousands of users finding their home.' : 'Enter your details to access your account.'}
            </p>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl mb-6 flex items-start gap-3 text-sm">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    {error}
                </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
                
                {isSignUp && (
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
                        onChange={handleChange}
                        className="w-full bg-gray-900/60 border border-gray-600 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-500"
                    />
                </div>

                <div className="relative group">
                    <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-400 transition-colors" size={20} />
                    <input 
                        name="password"
                        type="password" 
                        placeholder="Password"
                        required
                        onChange={handleChange}
                        className="w-full bg-gray-900/60 border border-gray-600 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-500"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 mt-2"
                >
                    {loading ? <Loader2 className="animate-spin" /> : (
                        <>
                            {isSignUp ? 'Sign Up' : 'Sign In'} <ArrowRight size={20} />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-6 text-center text-sm">
                <span className="text-gray-400">
                    {isSignUp ? "Already have an account?" : "Don't have an account?"}
                </span>
                <button 
                    onClick={toggleMode}
                    className="ml-2 text-blue-400 hover:text-blue-300 font-bold hover:underline transition-colors"
                >
                    {isSignUp ? 'Log In' : 'Sign Up'}
                </button>
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