import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, HelpCircle, Lock } from 'lucide-react';

const Legal = () => {
  const { type } = useParams(); 

  const content = {
    'privacy': {
      title: 'Privacy Policy',
      icon: <Lock size={48} className="text-blue-500" />,
      text: 'At RentFlow, we value your privacy. We do not sell your data. This is a portfolio project demonstrating full-stack capabilities.'
    },
    'terms': {
      title: 'Terms of Service',
      icon: <FileText size={48} className="text-purple-500" />,
      text: 'By using RentFlow, you agree that this is a demonstration platform. No real payments are processed, and listings are for educational purposes.'
    },
    'safety': {
      title: 'Safety Information',
      icon: <Shield size={48} className="text-green-500" />,
      text: 'RentFlow recommends meeting landlords in public places and never transferring money before viewing a property.'
    },
    'help': {
      title: 'Help Center',
      icon: <HelpCircle size={48} className="text-orange-500" />,
      text: 'Need help? Since this is a portfolio project, please contact the developer via LinkedIn or GitHub linked in the footer.'
    }
  };

  const data = content[type] || content['help'];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-gray-800 rounded-3xl p-8 border border-gray-700 shadow-2xl">
        <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={20} className="mr-2" /> Back to Home
        </Link>
        
        <div className="flex flex-col items-center text-center space-y-6">
            <div className="p-4 bg-gray-900 rounded-full border border-gray-700">
                {data.icon}
            </div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {data.title}
            </h1>
            
            <p className="text-gray-300 text-lg leading-relaxed">
                {data.text}
            </p>

            <div className="w-full border-t border-gray-700 pt-6 mt-6">
                <p className="text-sm text-gray-500">
                    Last Updated: {new Date().toLocaleDateString()}
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Legal;