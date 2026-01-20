import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { LogOut, Home, PlusSquare, User, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
       setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          RoomFinder
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/" className="text-gray-300 hover:text-white flex items-center gap-2">
            <Home size={18} /> Home
          </Link>
          
          {user ? (
            <>
              <Link to="/add-room" className="text-gray-300 hover:text-white flex items-center gap-2">
                <PlusSquare size={18} /> Post Room
              </Link>
              <Link to="/dashboard" className="text-gray-300 hover:text-white flex items-center gap-2">
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-700">
                <span className="text-xs text-gray-500 hidden md:block">{user.email}</span>
                <button onClick={handleLogout} className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-bold">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </>
          ) : (
            <Link to="/login">
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg font-bold transition-all shadow-lg shadow-blue-500/20">
                Login / Signup
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;