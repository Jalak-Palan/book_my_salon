import React from 'react';

const StatsChart = () => {
    return (
        <div className="booking-chart-placeholder">
            <div className="chart-header">
                <h2>Weekly Booking Statistics</h2>
                <select className="px-2 py-1 rounded-md border border-gray-200 text-sm outline-none">
                    <option>This Week</option>
                    <option>Last Week</option>
                </select>
            </div>
            <div className="mock-chart">
                {[40, 60, 80, 50, 90, 70, 65].map((h, i) => (
                    <div key={i} className={`chart-bar${i === 4 ? ' active' : ''}`} style={{ height: `${h}%` }} />
                ))}
            </div>
            <div className="chart-labels">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <span key={d}>{d}</span>)}
            </div>
        </div>
    );
};

export default StatsChart;
