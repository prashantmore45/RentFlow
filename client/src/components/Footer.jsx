import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, MapPin, Phone, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center group">
                <div className="relative h-12 md:h-16 w-auto overflow-hidden transition-all duration-300 group-hover:scale-105">
                    <img 
                        src="/logo.png" 
                        alt="RentFlow Logo" 
                        className="h-full w-auto object-contain"
                    />
                </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Simplifying the rental journey for tenants and landlords. 
              Find your flow, find your home.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Platform</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              
              <li>
                <Link to="/" className="hover:text-blue-400 transition-colors">Find a Room</Link>
              </li>
              
              <li>
                <Link to="/add-room" className="hover:text-blue-400 transition-colors">List Property</Link>
              </li>
              
              <li>
                <Link to="/dashboard/tenant" className="hover:text-blue-400 transition-colors">Tenant Dashboard</Link>
              </li>
              
              <li>
                <Link to="/login" className="hover:text-blue-400 transition-colors">Login / Sign Up</Link>
              </li>

              <li>
                <Link to="/favorites" className="hover:text-blue-400 transition-colors">My Favorites ❤️</Link>
              </li>

            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h3 className="text-white font-semibold mb-6">Support</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              
              <li>
                <Link to="/legal/help" className="hover:text-blue-400 transition-colors">Help Center</Link>
              </li>
              
              <li>
                <Link to="/legal/safety" className="hover:text-blue-400 transition-colors">Safety Information</Link>
              </li>
              
              <li>
                <Link to="/legal/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
              </li>
             
              <li>
                <Link to="/legal/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link>
              </li>

            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-purple-500 shrink-0 mt-0.5" />
                <span>Pune, Maharashtra, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-purple-500 shrink-0" />
                <span>support@rentflow.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-purple-500 shrink-0" />
                <span>+91 9405460695</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright & Socials */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} RentFlow. Built by <span className="text-blue-400">Prashant More</span>.
          </p>
          
          <div className="flex items-center gap-6">
            <a href="https://github.com/prashantmore45" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:bg-gray-700 hover:text-white transition-colors rounded-full p-1">
              <Github size={20} />
            </a>
            <a href="https://www.linkedin.com/in/prashantmore45/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:bg-blue-700 hover:text-white transition-colors rounded-full p-1">
              <Linkedin size={20} />
            </a>
            <a href="https://x.com/PrashantMo63581" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:bg-blue-500 hover:text-white transition-colors rounded-full p-1">
              <Twitter size={20} />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;