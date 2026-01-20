import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Home } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-white mb-4">
             <Home className="text-purple-500" /> RoomFinder
          </Link>
          <p className="text-sm leading-relaxed">
            The modern way to find your next home. Connect directly with landlords and find the perfect vibe for your lifestyle.
          </p>
        </div>

        <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-purple-400 transition-colors">Home</Link></li>
                <li><Link to="/add-room" className="hover:text-purple-400 transition-colors">Post a Room</Link></li>
                <li><Link to="/dashboard" className="hover:text-purple-400 transition-colors">Dashboard</Link></li>
            </ul>
        </div>

        <div>
            <h4 className="text-white font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-purple-400">Help Center</a></li>
                <li><a href="#" className="hover:text-purple-400">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-purple-400">Terms of Service</a></li>
            </ul>
        </div>

        <div>
            <h4 className="text-white font-bold mb-4">Follow Us</h4>
            <div className="flex gap-4">
                <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 hover:text-white transition-all"><Facebook size={18} /></a>
                <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-blue-400 hover:text-white transition-all"><Twitter size={18} /></a>
                <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-pink-600 hover:text-white transition-all"><Instagram size={18} /></a>
                <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-blue-700 hover:text-white transition-all"><Linkedin size={18} /></a>
            </div>
        </div>

      </div>
      
      <div className="text-center mt-12 pt-8 border-t border-gray-800 text-xs text-gray-600">
        © 2024 RoomFinder Inc. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;