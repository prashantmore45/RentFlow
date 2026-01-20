import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import Home from './pages/Home';
import AddRoom from './pages/AddRoom';
import RoomDetails from './pages/RoomDetails';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-room" element={<AddRoom />} />
        <Route path="/room/:id" element={<RoomDetails />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;