import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar'; 
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import AddRoom from './pages/AddRoom';
import RoomDetails from './pages/RoomDetails';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Footer from './components/Footer';
import EditRoom from './pages/EditRoom';
import Profile from './pages/Profile';
import Legal from './pages/Legal';
import Favorites from './pages/Favorites';
import Chat from './pages/Chat';
import MapSearch from './pages/MapSearch';


function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#1f2937', color: '#fff' } }} />
      <Navbar />
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/map-search" element={<MapSearch />} />
            <Route path="/add-room" element={<AddRoom />} />
            <Route path="/room/:id" element={<RoomDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/edit-room/:id" element={<EditRoom />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/legal/:type" element={<Legal />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/chat/:roomId/:landlordId" element={<Chat />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;