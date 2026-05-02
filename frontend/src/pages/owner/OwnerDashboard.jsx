import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import TopNavbar from '../../components/layout/TopNavbar';
import DashboardStats from '../../components/dashboard/DashboardStats';
import AppointmentsTable from '../../components/booking/AppointmentsTable';
import TimeSlotsEditor from '../../components/booking/TimeSlotsEditor';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { Loader2 } from 'lucide-react';

import DashboardHeader from './components/DashboardHeader';
import UpgradePanel from './components/UpgradePanel';
import StatsChart from './components/StatsChart';

import './OwnerDashboard.css';

const getOwnerThemeConfig = (type) => {
    switch (type) {
        case 'men':
            return { class: 'men-theme', headerClass: 'men-header-active', badge: "Men's Grooming Portal", image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1200' };
        case 'women':
            return { class: 'women-theme', headerClass: 'women-header-active', badge: "Women's Beauty Portal", image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1200' };
        case 'home':
            return { class: 'home-theme', headerClass: 'home-header-active', badge: 'Home Service Portal', image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=1200' };
        default:
            return { class: 'spa-theme', headerClass: 'spa-header-active', badge: 'Partner Portal', image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=1200' };
    }
};

const OwnerDashboard = ({ serviceType }) => {
    const { user } = useAuth();
    const [salon, setSalon] = useState(null);
    const [ownerDetails, setOwnerDetails] = useState(null);
    const [stats, setStats] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const theme = getOwnerThemeConfig(serviceType || salon?.category);

    const fetchDashboardData = useCallback(async (showLoading = false) => {
        if (showLoading) setLoading(true);

        try {
            if (!user) { setLoading(false); return; }
            if (user.role !== 'salon_owner' && user.role !== 'admin') {
                setError('Not authorized. Please login as a salon owner.');
                setLoading(false);
                return;
            }

            const [salonRes, ownerRes] = await Promise.all([
                API.get(`/salons?ownerId=${user.id || user._id}`).catch(() => ({ data: { data: [] } })),
                API.get('/owner-details/me').catch(() => ({ data: { data: null } }))
            ]);

            const mySalon = salonRes.data.data?.[0];
            setSalon(mySalon);
            setOwnerDetails(ownerRes.data.data);

            if (mySalon) {
                const [statsRes, bookingsRes, slotsRes] = await Promise.all([
                    API.get(`/dashboard/${user.id || user._id}`).catch(() => ({ data: { data: null } })),
                    API.get(`/bookings/salon/${mySalon._id || mySalon.id}`).catch(() => ({ data: { data: [] } })),
                    API.get(`/slots/${mySalon._id || mySalon.id}`).catch(() => ({ data: { data: [] } }))
                ]);

                setStats(statsRes.data.data);
                setBookings(bookingsRes.data.data || []);
                setSlots(slotsRes.data.data || []);
            }
        } catch (err) {
            console.error('Dashboard Fetch Error:', err);
            setError('Failed to fetch dashboard data. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchDashboardData(true);
        const interval = setInterval(() => fetchDashboardData(false), 10000);
        return () => clearInterval(interval);
    }, [fetchDashboardData]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                <p className="text-gray-500 font-medium">Syncing your dashboard...</p>
            </div>
        );
    }

    const salonStatus = ownerDetails || salon;
    const salonId = ownerDetails?._id || salon?._id;

    return (
        <div className={`owner-dashboard-container ${theme.class}`}>
            <Sidebar />
            <div className="dashboard-main">
                <TopNavbar />

                <div className="dashboard-content">
                    <DashboardHeader 
                        theme={theme} 
                        salon={salon} 
                        ownerDetails={ownerDetails} 
                        user={user} 
                    />

                    <DashboardStats statsData={stats} />

                    {salonId && (
                        <UpgradePanel
                            salonId={salonId}
                            currentStatus={{
                                isRecommended: salonStatus?.isRecommended,
                                isTopRated: salonStatus?.isTopRated,
                                rating: salonStatus?.rating,
                                reviewsCount: salonStatus?.reviewsCount
                            }}
                            onUpgrade={() => fetchDashboardData(false)}
                        />
                    )}

                    <div className="dashboard-grid">
                        <div className="grid-left">
                            <AppointmentsTable bookings={bookings} />
                            <StatsChart />
                        </div>

                        <div className="grid-right">
                            <TimeSlotsEditor slots={slots} />

                            <div className="recent-customers-card text-center">
                                <h2>Live Status</h2>
                                <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 mb-4">
                                    <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1">Status</p>
                                    <p className="text-xl font-black text-gray-900">OPEN</p>
                                </div>
                                <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                                    <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">Queue</p>
                                    <p className="text-xl font-black text-gray-900">{bookings.filter(b => b.status === 'confirmed').length} Active</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;
