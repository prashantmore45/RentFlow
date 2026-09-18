import { Link } from 'react-router-dom';
import { Search, MessageCircle, Key, Shield, Users, Clock, Star, HelpCircle, CheckCircle, MapPin } from 'lucide-react';

export const Stats = () => (
    <div className="border-y border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
            { label: "Active Listings", val: "1,200+", icon: <CheckCircle className="text-green-400 mb-2 mx-auto" /> },
            { label: "Happy Tenants", val: "850+", icon: <Users className="text-blue-400 mb-2 mx-auto" /> },
            { label: "Cities Covered", val: "12", icon: <MapPin className="text-purple-400 mb-2 mx-auto" /> },
            { label: "Average Rating", val: "4.8/5", icon: <Star className="text-yellow-400 mb-2 mx-auto" /> },
        ].map((stat, idx) => (
            <div key={idx} className="group">
                {stat.icon}
                <h3 className="font-heading text-3xl font-bold text-white mb-1 group-hover:scale-110 transition-transform">{stat.val}</h3>
                <p className="text-gray-500 text-sm uppercase tracking-wider">{stat.label}</p>
            </div>
        ))}
        </div>
    </div>
);

export const HowItWorks = () => (
    <div className="py-20 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-12">How RentFlow Works ?</h2>
            <div className="grid md:grid-cols-3 gap-8 relative">
                <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-gray-700 -z-10"></div>
                {[
                    { title: "Search", desc: "Browse thousands of verified listings by location and price.", icon: <Search size={32} /> },
                    { title: "Connect", desc: "Chat directly with landlords. No hidden agent fees.", icon: <MessageCircle size={32} /> },
                    { title: "Move In", desc: "Seal the deal and move into your new home hassle-free.", icon: <Key size={32} /> }
                ].map((step, i) => (
                    <div key={i} className="relative bg-gray-900 p-8 rounded-3xl border border-gray-800 shadow-xl">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg shadow-blue-500/20">
                            {step.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-3">0{i+1}. {step.title}</h3>
                        <p className="text-gray-400">{step.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export const Features = () => (
    <div className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">Why Choose Us?</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">We are not just a listing site. We are a complete rental ecosystem designed for safety and speed.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { title: "Verified Listings", desc: "Every home is physically verified by our team to ensure zero fraud.", icon: <Shield size={40} className="text-blue-500" /> },
                    { title: "Direct Connection", desc: "Connect directly with landlords. No middle-men, no hidden brokerage fees.", icon: <Users size={40} className="text-purple-500" /> },
                    { title: "Fast Approval", desc: "Apply online and get approved in hours, not weeks. Move in faster.", icon: <Clock size={40} className="text-green-500" /> },
                ].map((feature, i) => (
                    <div key={i} className="bg-gray-800 p-8 rounded-3xl border border-gray-700 hover:border-blue-500/50 transition-all hover:shadow-2xl hover:shadow-blue-500/10 group">
                        <div className="mb-6 p-4 bg-gray-900 rounded-2xl w-fit group-hover:scale-110 transition-transform border border-gray-700">{feature.icon}</div>
                        <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                        <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export const Testimonials = () => (
    <div className="py-24 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4">
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-center mb-12">Trusted by Students & Professionals</h2>
            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { name: "Aditi S.", role: "Student, Pune", text: "I found a shared flat near my college in 2 days. The direct chat feature saved me so much time!" },
                    { name: "Rahul M.", role: "IT Professional", text: "Moving to a new city is hard, but RentFlow made it easy. Verified listings gave me peace of mind." },
                    { name: "Suresh K.", role: "Landlord", text: "I manage 5 properties. The dashboard helps me track applications easily. Highly recommended." }
                ].map((review, i) => (
                    <div key={i} className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                        <div className="flex gap-1 text-yellow-500 mb-4">
                            {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                        </div>
                        <p className="text-gray-300 mb-6 italic">"{review.text}"</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold">
                                {review.name[0]}
                            </div>
                            <div>
                                <h4 className="font-bold">{review.name}</h4>
                                <p className="text-xs text-gray-500">{review.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export const FAQ = () => (
    <div className="py-24 bg-gray-900">
        <div className="max-w-3xl mx-auto px-4">
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-4">
                {[
                    { q: "Is RentFlow free to use?", a: "Yes! Tenants can search and apply for free. Landlords get 1 free listing." },
                    { q: "Are the landlords verified?", a: "We perform a basic KYC check on all landlords to ensure safety." },
                    { q: "Can I contact the owner directly?", a: "Yes, once you log in, you can see contact details or chat directly." }
                ].map((faq, i) => (
                    <div key={i} className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                            <HelpCircle size={20} className="text-blue-500" /> {faq.q}
                        </h3>
                        <p className="text-gray-400 pl-7">{faq.a}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export const CTA = ({ user }) => (
    <div className="bg-gradient-to-r from-blue-900 to-purple-900 py-20 relative overflow-hidden mt-20">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6 text-white">
                {user?.role === 'landlord' ? 'Ready to find a tenant?' : 'Ready to find your new place?'}
            </h2>
            <div className="flex justify-center">
                {user ? (
                     user.role === 'landlord' ? (
                         <Link to="/add-room" className="bg-white text-blue-900 font-bold py-4 px-10 rounded-xl hover:bg-gray-100 transition-colors shadow-2xl">
                            Post a Room Now
                        </Link>
                     ) : (
                         <Link to="/map-search" className="bg-white text-blue-900 font-bold py-4 px-10 rounded-xl hover:bg-gray-100 transition-colors shadow-2xl">
                            Search Rooms
                        </Link>
                     )
                ) : (
                    <Link to="/login" state={{ mode: 'signup' }} className="bg-white text-blue-900 font-bold py-4 px-10 rounded-xl hover:bg-gray-100 transition-colors shadow-2xl">
                        Get Started for Free
                    </Link>
                )}
            </div>
        </div>
    </div>
);
