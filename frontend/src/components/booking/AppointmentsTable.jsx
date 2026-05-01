import React from 'react';
import { MoreHorizontal, ExternalLink } from 'lucide-react';

const AppointmentsTable = ({ bookings = [] }) => {
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const formatTime = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return 'TBD';
    }
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <h2>Recent Appointments</h2>
        <button className="view-all">View All</button>
      </div>
      <table className="appointments-table">
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Service</th>
            <th>Time</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length > 0 ? (
            bookings.map((apt, index) => (
              <tr key={apt._id || index}>
                <td>{apt.userId?.name || 'Guest'}</td>
                <td>{apt.service}</td>
                <td>{apt.slot?.time || formatTime(apt.date)}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(apt.status)}`}>
                    {apt.status}
                  </span>
                </td>
                <td className="action-cell">
                  <button title="Edit"><MoreHorizontal size={18} /></button>
                  <button title="View"><ExternalLink size={18} /></button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-8 text-gray-500 font-medium">
                No appointments found for today.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentsTable;
