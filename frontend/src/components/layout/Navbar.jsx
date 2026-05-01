import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, Menu, User, Map as MapIcon } from 'lucide-react';
import ProfileSidebar from '../dashboard/ProfileSidebar';
import LocationModal from '../ui/LocationModal';
import LoginModal from '../ui/LoginModal';
import Logo from '../common/Logo';
import { useLocation } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ setServiceType, serviceType }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { selectedCity, setSelectedCity } = useLocation();
    const { user } = useAuth();

    return (
        <header className="bg-white w-full border-b border-gray-200 sticky top-0 z-40">
            {/* Top Bar: Logo, Search, Location, Profile */}
            <div className="w-full px-4 md:px-12">
                <div className="flex items-center justify-between h-16">

                    {/* Left: Logo + Search */}
                    <div className="flex items-center flex-1 space-x-6">
                        {/* Logo */}
                        <Link to="/" className="flex items-center shrink-0">
                            <Logo />
                        </Link>

                        {/* Search Bar */}
                        <div className="hidden md:flex relative flex-1 max-w-2xl">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-500" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors text-ellipsis"
                                placeholder="Search for Salons, Services, Appointments"
                            />
                        </div>
                    </div>

                    {/* Right: Location + Auth/Profile */}
                    <div className="flex items-center space-x-6 shrink-0 ml-6">

                        {/* Location Selector */}
                        <div
                            onClick={() => setIsLocationModalOpen(true)}
                            className="hidden md:flex items-center space-x-2 cursor-pointer group hover:bg-gray-50 px-3 py-2 rounded-md transition-colors border border-transparent hover:border-gray-200"
                        >
                            <span className="text-[15px] font-medium text-gray-700 group-hover:text-gray-900">{selectedCity}</span>
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                        </div>

                        {/* Sign In Button / Profile Row */}
                        <div className="flex items-center space-x-4">
                            {!user ? (
                                <div className="flex items-center space-x-3">
                                    <Link
                                        to="/login"
                                        className="text-gray-600 hover:text-primary px-3 py-2 font-bold text-[14px] transition-colors"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="bg-primary hover:bg-primary-hover text-white px-5 py-2 rounded-lg font-bold text-[14px] transition-all shadow-sm shadow-orange-100 active:scale-95"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-3 group">
                                    <span className="hidden sm:block text-[15px] font-medium text-gray-700 group-hover:text-primary transition-colors cursor-default">
                                        Hi, {user.name.split(' ')[0]}
                                    </span>
                                    {/* Profile Icon Button */}
                                    <button
                                        onClick={() => setIsProfileOpen(true)}
                                        className="w-9 h-9 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex justify-center items-center overflow-hidden transition-colors border border-gray-200 shadow-sm"
                                        aria-label="Open Profile Menu"
                                    >
                                        {user.picture ? (
                                            <img src={user.picture} alt={user.name} className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
                                        ) : (
                                            <User className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Icon */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden text-gray-700 p-2 hover:bg-gray-100 rounded-md transition-colors"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
                <div className="px-4 py-6 bg-white border-t border-gray-100 flex flex-col space-y-6 shadow-inner">
                    {!user ? (
                        <div className="flex flex-col space-y-3">
                            <Link
                                to="/signup"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-full py-4 bg-primary text-white text-center rounded-2xl font-bold shadow-lg shadow-orange-100 active:scale-95 transition-transform"
                            >
                                Create New Account
                            </Link>
                            <Link
                                to="/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-full py-4 bg-gray-50 text-gray-700 text-center rounded-2xl font-bold border border-gray-200 active:scale-95 transition-transform"
                            >
                                Sign In
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            {user.picture ? (
                                <img src={user.picture} alt={user.name} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                            ) : (
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                    <User className="w-6 h-6 text-primary" />
                                </div>
                            )}
                            <div>
                                <p className="text-sm text-gray-500 font-medium tracking-wide uppercase">Welcome back,</p>
                                <p className="text-xl font-extrabold text-gray-900">{user.name.split(' ')[0]}</p>
                            </div>
                        </div>
                    )}

                    <div className="h-px bg-gray-100 w-full"></div>
                    <Link
                        to="/salon-finder"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 p-3 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-sm shadow-lg shadow-orange-200"
                    >
                        <MapIcon size={20} />
                        Salon Finder
                    </Link>
                    <div className="grid grid-cols-2 gap-2">
                        <Link to="/category/hair" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg text-sm font-medium">Hair</Link>
                        <Link to="/category/spa" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg text-sm font-medium">Spa</Link>
                        <Link to="/category/nails" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg text-sm font-medium">Nails</Link>
                        <Link to="/category/massage" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg text-sm font-medium">Massage</Link>
                    </div>
                </div>
            </div>

            {/* Bottom Bar: Categories & Quick Links */}
            <div className="hidden md:block bg-gray-50 border-t border-gray-100">
                <div className="w-full px-12 flex items-center justify-between h-10">

                    {/* Main Categories (Left) */}
                    <div className="flex items-center space-x-6 text-[14px]">
                        <Link to="/category/hair" className="text-gray-600 hover:text-primary transition-colors">Hair</Link>
                        <Link to="/category/spa" className="text-gray-600 hover:text-primary transition-colors">Spa</Link>
                        <Link to="/category/nails" className="text-gray-600 hover:text-primary transition-colors">Nails</Link>
                        <Link to="/category/massage" className="text-gray-600 hover:text-primary transition-colors">Massage</Link>
                        <Link to="/packages" className="text-gray-600 hover:text-primary transition-colors">Packages</Link>
                        <Link to="/salon-finder" className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-4 py-1.5 rounded-full transition-all font-bold uppercase tracking-wider flex items-center gap-1.5 text-[12px]">
                            <MapIcon size={14} />
                            Salon Finder
                        </Link>
                        <button
                            onClick={() => {
                                localStorage.removeItem('serviceType');
                                setServiceType(null);
                            }}
                            className="flex items-center gap-1.5 text-primary hover:text-primary-hover font-medium transition-colors border-l border-gray-200 pl-4"
                        >
                            <span className="capitalize">{serviceType} Mode</span>
                            <span className="text-[10px] bg-primary/10 px-1.5 py-0.5 rounded text-primary">Change</span>
                        </button>
                    </div>

                    {/* Quick Links (Right) */}
                    <div className="flex items-center space-x-6 text-[12px] text-gray-500">
                        <Link to="/corporate" className="hover:text-gray-800 transition-colors">Corporate Bookings</Link>
                        <div className="h-4 w-[1px] bg-gray-200"></div>
                        <Link to="/owner-login" className="hover:text-primary transition-colors font-medium">Partner Login</Link>
                        <Link to="/partner-registration" className="text-primary font-bold hover:text-primary-hover transition-colors">Register Your Salon</Link>
                        <Link to="/giftcards" className="hover:text-gray-800 transition-colors">Gift Cards</Link>
                        <Link to="/special" className="hover:text-gray-800 transition-colors">Special Offers</Link>
                    </div>

                </div>
            </div>

            <ProfileSidebar isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
            <LocationModal
                isOpen={isLocationModalOpen}
                onClose={() => setIsLocationModalOpen(false)}
                selectedCity={selectedCity}
                onSelectCity={setSelectedCity}
            />
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />
        </header>
    );
};

// Simple User Icon component for the avatar placeholder to avoid importing User from lucide-react if not needed globally
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-500"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);

export default Navbar;
