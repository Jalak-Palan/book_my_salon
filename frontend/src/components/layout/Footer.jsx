import React from 'react';
import { Link } from 'react-router-dom';
import {
    Instagram, Facebook, Twitter, Youtube,
    MapPin, Phone, Mail, Scissors
} from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-gray-950 text-gray-300 mt-16">
            {/* Top section */}
            <div className="w-full px-6 sm:px-10 lg:px-16 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

                {/* Brand */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                            <Scissors className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white font-black text-xl tracking-tight">
                            Book<span className="text-orange-500">My</span>Salon
                        </span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                        India's fastest growing salon booking platform. Discover, book, and enjoy top salons near you in seconds.
                    </p>
                    <div className="flex items-center gap-3 pt-1">
                        <a href="https://instagram.com" target="_blank" rel="noreferrer"
                            className="w-9 h-9 bg-white/5 hover:bg-orange-500 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110">
                            <Instagram className="w-4 h-4" />
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noreferrer"
                            className="w-9 h-9 bg-white/5 hover:bg-orange-500 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110">
                            <Facebook className="w-4 h-4" />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer"
                            className="w-9 h-9 bg-white/5 hover:bg-orange-500 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110">
                            <Twitter className="w-4 h-4" />
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noreferrer"
                            className="w-9 h-9 bg-white/5 hover:bg-orange-500 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110">
                            <Youtube className="w-4 h-4" />
                        </a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="space-y-4">
                    <h3 className="text-white font-bold text-sm uppercase tracking-widest">Quick Links</h3>
                    <ul className="space-y-2.5 text-sm">
                        {[
                            { label: 'Home', to: '/' },
                            { label: 'Find a Salon', to: '/salon-finder' },
                            { label: 'My Bookings', to: '/my-bookings' },
                            { label: 'Partner With Us', to: '/partner-registration' },
                            { label: 'Owner Dashboard', to: '/owner-dashboard' },
                        ].map(link => (
                            <li key={link.to}>
                                <Link
                                    to={link.to}
                                    className="text-gray-400 hover:text-orange-400 transition-colors duration-150 flex items-center gap-1.5 group"
                                >
                                    <span className="w-1 h-1 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Services */}
                <div className="space-y-4">
                    <h3 className="text-white font-bold text-sm uppercase tracking-widest">Services</h3>
                    <ul className="space-y-2.5 text-sm">
                        {['Hair Styling', 'Spa & Wellness', 'Nail Care', 'Facial & Skin', 'Massage Therapy', 'Bridal Packages'].map(s => (
                            <li key={s}>
                                <span className="text-gray-400 hover:text-orange-400 transition-colors duration-150 cursor-pointer flex items-center gap-1.5 group">
                                    <span className="w-1 h-1 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    {s}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact */}
                <div className="space-y-4">
                    <h3 className="text-white font-bold text-sm uppercase tracking-widest">Contact Us</h3>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-start gap-3 text-gray-400">
                            <MapPin className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                            <span>BookMySalon HQ, Bandra West, Mumbai 400050, India</span>
                        </li>
                        <li>
                            <a href="tel:+918888888888" className="flex items-center gap-3 text-gray-400 hover:text-orange-400 transition-colors">
                                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                                +91 88888 88888
                            </a>
                        </li>
                        <li>
                            <a href="mailto:hello@bookmysalon.in" className="flex items-center gap-3 text-gray-400 hover:text-orange-400 transition-colors">
                                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                                hello@bookmysalon.in
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/10">
                <div className="w-full px-6 sm:px-10 lg:px-16 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
                    <p>© {currentYear} <span className="text-gray-300 font-semibold">BookMySalon</span>. All rights reserved.</p>
                    <div className="flex items-center gap-5">
                        <Link to="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
                        <Link to="/support" className="hover:text-gray-300 transition-colors">Support</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
