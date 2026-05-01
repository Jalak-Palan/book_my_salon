import React from 'react';
import { Search, MapPin, Bell, ChevronDown } from 'lucide-react';

const TopNavbar = () => {
  return (
    <header className="dashboard-top-navbar">
      <div className="search-container">
        <Search size={18} className="search-icon" />
        <input type="text" placeholder="Search appointments, customers..." />
      </div>

      <div className="navbar-actions">
        <div className="city-selector">
          <MapPin size={18} className="action-icon" />
          <span>Mumbai</span>
          <ChevronDown size={14} />
        </div>

        <button className="notification-btn">
          <Bell size={20} />
          <span className="notif-badge"></span>
        </button>

        <div className="profile-avatar">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
            alt="Profile" 
          />
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
