import React from 'react';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';

const DashboardHeader = ({ theme, salon, ownerDetails, user }) => {
    return (
        <div className={`dashboard-header ${theme.headerClass}`}>
            {theme.image && (
                <div className="spa-header-bg">
                    <img src={salon?.image || theme.image} alt="" />
                    <div className="spa-overlay"></div>
                </div>
            )}
            <div className="header-text-content">
                {theme.badge && <span className="spa-badge">{theme.badge}</span>}
                <div className="flex items-center justify-between w-full">
                    <div>
                        <h1>Good morning, {salon?.name || ownerDetails?.salonName || user?.name || 'Partner'}!</h1>
                        <p>Your salon is live. Here's what's happening today in real-time.</p>
                    </div>
                    <Link
                        to="/salon-onboarding"
                        className="bg-white/20 hover:bg-white/30 text-white px-6 py-2.5 rounded-xl font-bold backdrop-blur-md border border-white/30 transition-all flex items-center gap-2"
                    >
                        <Settings className="w-4 h-4" />
                        Edit Profile
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;
