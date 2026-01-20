import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Home } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isSignUp, setIsSignUp] = useState(false); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.mode === 'signup') {
      setIsSignUp(true);
    }
  }, [location.state]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("Account created! Check your email to verify.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/');
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 items-center justify-center relative overflow-hidden">
        <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl -top-10 -left-10"></div>
        <div className="absolute w-96 h-96 bg-black/10 rounded-full blur-3xl bottom-0 right-0"></div>
        
        <div className="text-center z-10 p-12">
            <div className="bg-white/20 p-4 rounded-2xl inline-block mb-6 backdrop-blur-lg">
                <Home size={48} />
            </div>
            <h1 className="text-5xl font-bold mb-4">Welcome Back</h1>
            <p className="text-xl text-blue-100">Your journey to finding the perfect space continues here.</p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold mb-2">{isSignUp ? "Create Account" : "Sign In"}</h2>
            <p className="text-gray-400 mb-8">
                {isSignUp ? "Join the community today." : "Enter your details to proceed."}
            </p>

            <form onSubmit={handleAuth} className="space-y-6">
                <div className="relative">
                    <Mail className="absolute left-4 top-4 text-gray-500" size={20} />
                    <input 
                        type="email" 
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 bg-gray-800 border border-gray-700 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                <div className="relative">
                    <Lock className="absolute left-4 top-4 text-gray-500" size={20} />
                    <input 
                        type="password" 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 bg-gray-800 border border-gray-700 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                    {loading ? "Processing..." : (isSignUp ? "Sign Up" : "Login")}
                    {!loading && <ArrowRight size={20} />}
                </button>
            </form>

            <p className="mt-8 text-center text-gray-400">
                {isSignUp ? "Already have an account?" : "Don't have an account?"} 
                <button 
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="ml-2 text-blue-400 font-semibold hover:underline"
                >
                    {isSignUp ? "Login" : "Sign Up"}
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;