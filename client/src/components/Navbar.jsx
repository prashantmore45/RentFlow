import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { LogOut, Home, PlusSquare, LayoutDashboard, Menu, X, User, Heart, ShieldAlert } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const fetchUserAndRole = async (authUser) => {
      if (!authUser) {
          setUser(null);
          localStorage.removeItem('user_role');
          return;
      }
      
      const cachedRole = localStorage.getItem(`role_${authUser.id}`);
      if (cachedRole) {
          setUser({ ...authUser, role: cachedRole });
      }

      try {
          const { data: profile } = await supabase.from('profiles').select('role').eq('id', authUser.id).single();
          const role = profile?.role || 'tenant';
          localStorage.setItem(`role_${authUser.id}`, role);
          setUser({ ...authUser, role });
      } catch (err) {
          if (!cachedRole) setUser({ ...authUser, role: 'tenant' });
      }
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
       if (session?.access_token && session?.user) {
           localStorage.setItem('access_token', session.access_token);
           localStorage.setItem('user_id', session.user.id);
       } else {
           localStorage.removeItem('access_token');
           localStorage.removeItem('user_id');
       }
       await fetchUserAndRole(session?.user);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    // 1. Instantly clear UI state
    setUser(null);
    setIsOpen(false);
    
    // 2. Clear all local storage caches
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_role');
    if (user) {
        localStorage.removeItem(`role_${user.id}`);
    }
    
    // 3. Force-clear Supabase's auth token from storage just in case signOut hangs
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
            localStorage.removeItem(key);
        }
    });

    try {
        await Promise.race([
            supabase.auth.signOut(),
            new Promise(resolve => setTimeout(resolve, 1000))
        ]);
    } catch (err) {
        console.error("Logout error ignored:", err);
    }
    
    // 4. Hard redirect to completely wipe any HMR memory deadlocks in the GoTrue client
    window.location.href = '/login';
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 md:h-20 items-center">
          
          {/* LOGO SECTION */}
          <Link to="/" className="flex items-center group">
            <div className="relative h-12 md:h-16 w-auto overflow-hidden transition-all duration-300 group-hover:scale-105">
                <img 
                    src="/logo.png" 
                    alt="RentFlow Logo" 
                    className="h-full w-auto object-contain"
                />
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            
            {user ? (
              <>
                {user.role !== 'admin' && (
                    <Link to="/" className="text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-lg transition-all flex items-center gap-2">
                        <Home size={18} /> Home
                    </Link>
                )}

                {user.role === 'landlord' && (
                    <Link to="/add-room" className="text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-lg transition-all flex items-center gap-2">
                      <PlusSquare size={18} /> Post Room
                    </Link>
                )}

                {user.role === 'tenant' && (
                    <Link to="/dashboard/tenant" className="text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-lg transition-all flex items-center gap-2">
                      <LayoutDashboard size={18} /> Dashboard
                    </Link>
                )}

                {user.role === 'landlord' && (
                    <Link to="/dashboard/host" className="text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-lg transition-all flex items-center gap-2">
                      <LayoutDashboard size={18} /> Host Dashboard
                    </Link>
                )}

                {user.role !== 'admin' && (
                    <Link to="/profile" className="text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-lg transition-all flex items-center gap-2">
                        <User size={18} /> Profile
                    </Link>
                )}
                
                {user.role === 'tenant' && (
                    <Link to="/favorites" className="text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-lg transition-all flex items-center gap-2">
                        <Heart size={18}   /> Favorites
                    </Link>
                )}

                {/* Admin Link (Conditional) */}
                {user.role === 'admin' && (
                    <Link to="/admin" className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-2 rounded-lg transition-all flex items-center gap-2 font-bold border border-red-500/20">
                      <ShieldAlert size={18} /> Admin
                    </Link>
                )}
                
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

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded-lg focus:outline-none transition-colors">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-gray-900 border-b border-gray-700 shadow-xl">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {(!user || user.role !== 'admin') && (
                <Link to="/" onClick={() => setIsOpen(false)} className="text-gray-300 hover:bg-gray-800 hover:text-white block px-3 py-3 rounded-md text-base font-medium flex items-center gap-3 transition-colors">
                <Home size={20} className="text-blue-400" /> Home
                </Link>
            )}
            
            {user ? (
              <>
                {user.role === 'landlord' && (
                    <Link to="/add-room" onClick={() => setIsOpen(false)} className="text-gray-300 hover:bg-gray-800 hover:text-white block px-3 py-3 rounded-md text-base font-medium flex items-center gap-3 transition-colors">
                    <PlusSquare size={20} className="text-purple-400" /> Post Room
                    </Link>
                )}
                {user.role === 'tenant' && (
                    <Link to="/dashboard/tenant" onClick={() => setIsOpen(false)} className="text-gray-300 hover:bg-gray-800 hover:text-white block px-3 py-3 rounded-md text-base font-medium flex items-center gap-3 transition-colors">
                    <LayoutDashboard size={20} className="text-blue-400" /> Dashboard
                    </Link>
                )}
                {user.role === 'landlord' && (
                    <Link to="/dashboard/host" onClick={() => setIsOpen(false)} className="text-gray-300 hover:bg-gray-800 hover:text-white block px-3 py-3 rounded-md text-base font-medium flex items-center gap-3 transition-colors">
                    <LayoutDashboard size={20} className="text-green-400" /> Host Dashboard
                    </Link>
                )}
                {user.role !== 'admin' && (
                    <Link to="/profile" onClick={() => setIsOpen(false)} className="text-gray-300 hover:bg-gray-800 hover:text-white block px-3 py-3 rounded-md text-base font-medium flex items-center gap-3 transition-colors">
                        <User size={20} /> Profile
                    </Link>
                )}
                {user.role === 'tenant' && (
                    <Link to="/favorites" onClick={() => setIsOpen(false)} className="text-gray-300 hover:bg-gray-800 hover:text-white block px-3 py-3 rounded-md text-base font-medium flex items-center gap-3 transition-colors">
                        <Heart size={20} className="text-pink-400" /> My Favorites
                    </Link>
                )}
                {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setIsOpen(false)} className="text-red-400 hover:bg-red-500/10 block px-3 py-3 rounded-md text-base font-medium flex items-center gap-3 transition-colors">
                      <ShieldAlert size={20} /> Admin Panel
                    </Link>
                )}
                <button onClick={handleLogout} className="w-full text-left text-red-400 hover:bg-red-500/10 hover:text-red-300 block px-3 py-3 rounded-md text-base font-medium flex items-center gap-3 mt-2 border-t border-gray-800 transition-colors">
                  <LogOut size={20} /> Logout
                </button>
              </>
            ) : (
              <div className="space-y-2 mt-4 px-2">
                <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center text-gray-300 hover:text-white py-3 rounded-xl border border-gray-700 font-medium hover:bg-gray-800 transition-colors">
                  Log In
                </Link>
                <Link to="/login" state={{ mode: 'signup' }} onClick={() => setIsOpen(false)} className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform">
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