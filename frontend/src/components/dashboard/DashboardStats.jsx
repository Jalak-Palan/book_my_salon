import React from 'react';
import { Calendar, Clock, Users, IndianRupee } from 'lucide-react';

const DashboardStats = ({ statsData }) => {
  const stats = [
    { 
      title: "Today's Bookings", 
      value: statsData?.todayBookings || "0", 
      icon: <Calendar />, 
      color: "#FFE4E1" 
    },
    { 
      title: "Upcoming", 
      value: statsData?.upcomingBookings || "0", 
      icon: <Clock />, 
      color: "#E0F2F1" 
    },
    { 
      title: "Total Bookings", 
      value: statsData?.totalBookings || "0", 
      icon: <Users />, 
      color: "#F3E5F5" 
    },
    { 
      title: "Active Services", 
      value: statsData?.pendingBookings || "0", 
      icon: <IndianRupee />, 
      color: "#FFF9C4" 
    },
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <div key={index} className="stat-card" style={{ backgroundColor: stat.color }}>
          <div className="stat-icon-wrapper">
            {stat.icon}
          </div>
          <div className="stat-info">
            <h3>{stat.value}</h3>
            <p>{stat.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
