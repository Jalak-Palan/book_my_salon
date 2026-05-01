import React, { useEffect } from 'react';
import {
    Settings, Gift, Aperture, ChevronRight, User, X, Info, Map as MapIcon, Scissors,
    Bell, ShoppingBag, Tv, CreditCard, MessageCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProfileSidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // Prevent body scroll when sidebar is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const handleSignOut = () => {
        if (logout) logout();
        navigate('/');
        onClose();
    };

    return (
        <>
            {/* Backdrop overlay */}
            <div
                className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={onClose}
            />

            {/* Sidebar panel */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-[400px] bg-white z-50 transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header section (Hey! & Avatar) */}
                <div className="flex items-center justify-between px-6 pt-10 pb-6 bg-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors hidden"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Hey!</h1>
                        <Link to="/profile" onClick={onClose} className="text-gray-500 flex items-center mt-1 text-sm hover:text-primary transition-colors">
                            Edit Profile <ChevronRight className="w-4 h-4 ml-0.5" />
                        </Link>
                    </div>
                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden border border-gray-200 shadow-sm">
                        {user?.picture ? (
                            <img src={user.picture} alt={user.name} className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
                        ) : (
                            <User className="w-10 h-10 text-white mt-3" />
                        )}
                    </div>
                </div>

                {/* Content area */}
                <div className="flex-1 overflow-y-auto bg-gray-50/20 pb-20">

                    {/* Yellow Banner Info (WhatsApp) */}
                    <div className="bg-[#fff9e6] border-y border-[#f6eeca] cursor-pointer hover:bg-[#fff5d6] transition-colors">
                        <div className="flex items-start px-6 py-4">
                            <div className="w-6 flex justify-center mt-0.5">
                                <Info className="w-5 h-5 text-gray-600 stroke-[1.5]" />
                            </div>
                            <div className="ml-4 flex-1">
                                <div className="text-[15px] text-gray-800">Get tickets on Whatsapp/SMS!</div>
                                <div className="text-[13px] text-gray-500 mt-0.5">Add your Mobile Number</div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                    </div>

                    {/* Menu List */}
                    <div className="flex flex-col bg-white">
                        <MenuItem icon={<Bell className="w-5 h-5 text-gray-600 stroke-[1.5]" />} title="Notifications" />
                        <MenuItem icon={<ShoppingBag className="w-5 h-5 text-gray-600 stroke-[1.5]" />} title="Your Orders" subtitle="View all your bookings & purchases" />
                        <MenuItem icon={<Tv className="w-5 h-5 text-gray-600 stroke-[1.5]" />} title="Stream Library" subtitle="Rented & Purchased Movies" />
                        <MenuItem icon={<CreditCard className="w-5 h-5 text-gray-600 stroke-[1.5]" />} title="Play Credit Card" subtitle="View your Play Credit Card details and offers" />
                        <MenuItem icon={<MessageCircle className="w-5 h-5 text-gray-600 stroke-[1.5]" />} title="Help & Support" subtitle="View commonly asked queries and Chat" />
                        <MenuItem icon={<Settings className="w-5 h-5 text-gray-600 stroke-[1.5]" />} title="Accounts & Settings" subtitle="Location, Payments, Permissions & More" />
                        <MenuItem icon={<Gift className="w-5 h-5 text-gray-600 stroke-[1.5]" />} title="Rewards" subtitle="View your rewards & unlock new ones" badge="2 Unopened" />
                        <MenuItem
                            icon={<MapIcon className="w-5 h-5 text-primary stroke-[2]" />}
                            title="Salon Finder"
                            subtitle="Locate salons near you on the map"
                            onClick={() => { navigate('/salon-finder'); onClose(); }}
                        />
                        <MenuItem 
                            icon={<Scissors className="w-5 h-5 text-gray-600 stroke-[1.5]" />} 
                            title="Salon Owner / Partner" 
                            subtitle={user?.role === 'salon_owner' ? "Go to Dashboard" : "Partner with us"} 
                            onClick={() => { 
                                navigate(user?.role === 'salon_owner' ? '/owner-dashboard' : '/owner-login'); 
                                onClose(); 
                            }}
                        />
                        <MenuItem icon={<Aperture className="w-5 h-5 text-gray-600 stroke-[1.5]" />} title="BookAChange" hasBorder={false} />
                    </div>
                </div>

                {/* Sign Out Button */}
                <div className="p-6 bg-gray-50/20">
                    <button
                        onClick={handleSignOut}
                        className="w-full py-3.5 rounded-lg border border-red-500 text-red-500 text-[15px] bg-white hover:bg-red-50 transition-colors"
                    >
                        Sign out
                    </button>
                </div>
            </div>
        </>
    );
};

const MenuItem = ({ icon, title, subtitle, badge, hasBorder = true, onClick }) => (
    <div
        onClick={onClick}
        className={`flex items-center px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${hasBorder ? 'border-b border-gray-100' : ''}`}
    >
        <div className="w-6 flex justify-center">
            {icon}
        </div>
        <div className="ml-4 flex-1">
            <div className="flex items-center text-[15px] text-gray-800">
                {title}
                {badge && (
                    <span className="ml-3 text-[10px] font-bold bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded uppercase tracking-wider">
                        {badge}
                    </span>
                )}
            </div>
            {subtitle && <div className="text-[13px] text-gray-500 mt-0.5">{subtitle}</div>}
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400" />
    </div>
);

export default ProfileSidebar;
