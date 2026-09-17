import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar'; 
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import AddRoom from './pages/AddRoom';
import RoomDetails from './pages/RoomDetails';
import Login from './pages/Login';
import Footer from './components/Footer';
import EditRoom from './pages/EditRoom';
import Profile from './pages/Profile';
import Legal from './pages/Legal';
import Favorites from './pages/Favorites';
import Chat from './pages/Chat';
import MapSearch from './pages/MapSearch';
import TenantDashboard from './pages/TenantDashboard';
import HostDashboard from './pages/HostDashboard';
import AdminDashboard from './pages/AdminDashboard';


function AppContent() {
  const location = useLocation();
  const isChatRoute = location.pathname.startsWith('/chat');

  return (
    <div className={`flex flex-col ${isChatRoute ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <ScrollToTop />
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#1f2937', color: '#fff' } }} />
      <Navbar />
      <div className={`flex-1 flex flex-col ${isChatRoute ? 'min-h-0' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map-search" element={<MapSearch />} />
          <Route path="/add-room" element={<AddRoom />} />
          <Route path="/room/:id" element={<RoomDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard/tenant" element={<TenantDashboard />} />
          <Route path="/dashboard/host" element={<HostDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/edit-room/:id" element={<EditRoom />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/legal/:type" element={<Legal />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/chat/:roomId/:otherUserId" element={<Chat />} />
        </Routes>
      </div>
      {!isChatRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;