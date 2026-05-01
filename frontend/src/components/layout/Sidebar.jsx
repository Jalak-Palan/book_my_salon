import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  CalendarDays, 
  Scissors, 
  Users, 
  Star, 
  Settings, 
  LogOut 
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/owner-dashboard' },
    { name: 'Appointments', icon: <CalendarCheck size={20} />, path: '/owner-dashboard/appointments' },
    { name: 'Calendar', icon: <CalendarDays size={20} />, path: '/owner-dashboard/calendar' },
    { name: 'Services', icon: <Scissors size={20} />, path: '/owner-dashboard/services' },
    { name: 'Customers', icon: <Users size={20} />, path: '/owner-dashboard/customers' },
    { name: 'Reviews', icon: <Star size={20} />, path: '/owner-dashboard/reviews' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/owner-dashboard/settings' },
  ];

  return (
    <aside className="dashboard-sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              `sidebar-item ${isActive ? 'active' : ''}`
            }
          >
            <span className="item-icon">{item.icon}</span>
            <span className="item-name">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-button">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
