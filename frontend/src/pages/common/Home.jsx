import React, { useRef, useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import API, { getCities } from '../../services/api';
import { premiumImages, salonNames, getSafeImage } from '../../constants/salonImages';
import { useLocation as useLocationContext } from '../../context/LocationContext';

import SearchSection from '../../components/home/SearchSection';
import HomeServiceCards from '../../components/home/HomeServiceCards';
import RecommendedSalons from '../../components/home/RecommendedSalons';
import TopRatedSalons from '../../components/home/TopRatedSalons';
import SEO from '../../components/common/SEO';

// Build the location-safe field from any salon object shape
const getSafeLocation = (s) => {
    if (typeof s.city === 'string') return s.city;
    if (typeof s.salonAddress === 'string') return s.salonAddress;
    if (typeof s.location === 'string') return s.location;
    if (s.address && typeof s.address === 'string') return s.address;
    return 'Premium Area';
};

const buildRecommendedList = (recommended) => {
    const base = recommended.map((s, idx) => ({
        id: s._id || s.id,
        slug: s.slug,
        name: s.salonName || s.name || 'Unknown Salon',
        city: getSafeLocation(s),
        likes: s.likes || `${(5.5 - idx * 0.3).toFixed(1)}k+`,
        rating: typeof s.rating === 'number' ? s.rating : 4.5,
        image: s.image || (s.images && s.images[0]) || getSafeImage(s._id || s.id)
    }));

    const mockCount = base.length < 3 ? 10 - base.length : 0;
    const mocks = Array.from({ length: mockCount }).map((_, idx) => {
        const i = base.length + idx;
        return { id: `mock-rec-${i}`, name: salonNames[i % salonNames.length], city: 'Mumbai', likes: `${(5.5 - i * 0.3).toFixed(1)}k+`, rating: 4.8 - i * 0.1, image: getSafeImage(`rec-fallback-${i}`) };
    });
    return [...base, ...mocks];
};

const buildTopRatedList = (topRated) => {
    const base = topRated.map((s, idx) => ({
        id: s._id || s.id,
        slug: s.slug,
        name: s.salonName || s.name || 'Unknown Salon',
        rating: typeof s.rating === 'number' ? s.rating.toFixed(1) : (s.rating || '4.5'),
        reviews: s.reviews || Math.floor(150 + idx * 50),
        location: getSafeLocation(s),
        distance: s.distance || `${(idx + 1.2).toFixed(1)} km`,
        badge: idx === 0 ? 'Top Pick' : 'Highly Rated',
        price: s.price || '₹599',
        image: s.image || (s.images && s.images[0]) || getSafeImage(`top-${s._id || s.id}`),
        services: Array.isArray(s.services) && s.services.length > 0
            ? (typeof s.services[0] === 'object' ? s.services.map(ser => ser.name) : s.services)
            : ['Haircut', 'Spa', 'Styling']
    }));

    const mockCount = base.length < 4 ? 8 - base.length : 0;
    const mocks = Array.from({ length: mockCount }).map((_, idx) => {
        const i = base.length + idx;
        return { id: `mock-tr-${i}`, name: salonNames[(i + 2) % salonNames.length], rating: (4.8 - i * 0.1).toFixed(1), reviews: 150 + i * 50, location: 'Bandra West', distance: `${(i + 1.2).toFixed(1)} km`, badge: i === 0 ? 'Top Pick' : 'Highly Rated', price: '₹599', image: getSafeImage(`top-fallback-${i}`), services: ['Haircut', 'Spa', 'Styling'] };
    });
    return [...base, ...mocks];
};

const Home = () => {
    const scrollContainerRef = useRef(null);
    const { selectedCity } = useLocationContext();
    const [recommended, setRecommended] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                setLoading(true);
                const [recRes, topRes, citiesRes] = await Promise.all([
                    API.get('/salons/recommended'),
                    API.get('/salons/top-rated'),
                    getCities()
                ]);
                if (isMounted) {
                    setRecommended(Array.isArray(recRes?.data?.data) ? recRes.data.data : []);
                    setTopRated(Array.isArray(topRes?.data?.data) ? topRes.data.data : []);
                    setCities(Array.isArray(citiesRes?.data?.data) ? citiesRes.data.data : []);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    console.error('API Error:', err);
                    setError('Unable to reach the server. Showing fallback content.');
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchData();
        return () => { isMounted = false; };
    }, []);

    const scrollLeft = () => scrollContainerRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
    const scrollRight = () => scrollContainerRef.current?.scrollBy({ left: 300, behavior: 'smooth' });

    if (loading) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                <p className="text-gray-500 font-medium animate-pulse">Finding the best salons for you...</p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-700">
            <SEO 
                title={`Best Salons in ${selectedCity}`} 
                description={`Discover and book top-rated salons, spas, and beauty parlors in ${selectedCity}. Compare prices, ratings, and reviews in seconds.`}
            />
            
            <header className="sr-only">
                <h1>Book My Salon - Find and Book the Best Salons in {selectedCity}</h1>
            </header>

            <SearchSection cities={cities} error={error} />
            <HomeServiceCards />
            <RecommendedSalons
                salons={buildRecommendedList(recommended)}
                scrollContainerRef={scrollContainerRef}
                onScrollLeft={scrollLeft}
                onScrollRight={scrollRight}
            />
            <TopRatedSalons salons={buildTopRatedList(topRated)} />
        </div>
    );
};

export default Home;

