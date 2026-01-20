import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { LogOut, Home, PlusSquare, LayoutDashboard, Menu, X } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

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
    setIsOpen(false);
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
            RoomFinder
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/" className="text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-lg transition-all flex items-center gap-2">
              <Home size={18} /> Home
            </Link>
            
            {user ? (
              <>
                <Link to="/add-room" className="text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-lg transition-all flex items-center gap-2">
                  <PlusSquare size={18} /> Post Room
                </Link>
                <Link to="/dashboard" className="text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-lg transition-all flex items-center gap-2">
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
                
                <div className="flex items-center gap-4 ml-2 pl-4 border-l border-gray-700">
                  <button onClick={handleLogout} className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-bold border border-red-500/20">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <button className="text-gray-300 hover:text-white font-medium px-4 py-2 transition-colors hover:bg-gray-800 rounded-lg">
                    Login
                  </button>
                </Link>

                <Link to="/login" state={{ mode: 'signup' }}>
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-5 py-2 rounded-xl font-bold transition-all shadow-lg shadow-purple-500/20 hover:scale-105 active:scale-95">
                    Get Started
                  </button>
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded-lg focus:outline-none transition-colors">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gray-900 border-b border-gray-700 shadow-xl">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={() => setIsOpen(false)} className="text-gray-300 hover:bg-gray-800 hover:text-white block px-3 py-3 rounded-md text-base font-medium flex items-center gap-3 transition-colors">
              <Home size={20} className="text-blue-400" /> Home
            </Link>
            
            {user ? (
              <>
                <Link to="/add-room" onClick={() => setIsOpen(false)} className="text-gray-300 hover:bg-gray-800 hover:text-white block px-3 py-3 rounded-md text-base font-medium flex items-center gap-3 transition-colors">
                  <PlusSquare size={20} className="text-purple-400" /> Post Room
                </Link>
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-gray-300 hover:bg-gray-800 hover:text-white block px-3 py-3 rounded-md text-base font-medium flex items-center gap-3 transition-colors">
                  <LayoutDashboard size={20} className="text-green-400" /> Dashboard
                </Link>
                <button onClick={handleLogout} className="w-full text-left text-red-400 hover:bg-red-500/10 hover:text-red-300 block px-3 py-3 rounded-md text-base font-medium flex items-center gap-3 mt-2 border-t border-gray-800 transition-colors">
                  <LogOut size={20} /> Logout
                </button>
              </>
            ) : (
              <div className="space-y-2 mt-4 px-2">
                <Link 
                  to="/login" 
                  onClick={() => setIsOpen(false)} 
                  className="block w-full text-center text-gray-300 hover:text-white py-3 rounded-xl border border-gray-700 font-medium hover:bg-gray-800 transition-colors"
                >
                  Log In
                </Link>
                
                <Link 
                  to="/login" 
                  state={{ mode: 'signup' }} 
                  onClick={() => setIsOpen(false)} 
                  className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;