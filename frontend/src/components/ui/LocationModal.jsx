import React, { useState, useMemo } from 'react';
import { Search, MapPin, X, ArrowLeft, Loader2 } from 'lucide-react';
import citiesSprite from '../../assets/cities.png';

const popularCities = [
    { name: 'Mumbai', bgPos: '0%' },
    { name: 'Kochi', bgPos: '11.11%' },
    { name: 'Delhi-NCR', bgPos: '22.22%' },
    { name: 'Bengaluru', bgPos: '33.33%' },
    { name: 'Hyderabad', bgPos: '44.44%' },
    { name: 'Chandigarh', bgPos: '55.55%' },
    { name: 'Ahmedabad', bgPos: '66.66%' },
    { name: 'Pune', bgPos: '77.77%' },
    { name: 'Chennai', bgPos: '88.88%' },
    { name: 'Kolkata', bgPos: '100%' }
];

// Extended list of cities for the "View All" section
const allCities = [
    'Agra', 'Ahmedabad', 'Ajmer', 'Aligarh', 'Allahabad', 'Amritsar', 'Aurangabad',
    'Bengaluru', 'Bhopal', 'Bhubaneswar', 'Chandigarh', 'Chennai', 'Coimbatore', 'Dehradun',
    'Delhi-NCR', 'Dhanbad', 'Faridabad', 'Ghaziabad', 'Guwahati', 'Gwalior', 'Hyderabad',
    'Indore', 'Jabalpur', 'Jaipur', 'Jalandhar', 'Jamshedpur', 'Jodhpur', 'Kanpur',
    'Kochi', 'Kolkata', 'Kota', 'Lucknow', 'Ludhiana', 'Madurai', 'Meerut',
    'Mumbai', 'Mysore', 'Nagpur', 'Nashik', 'Patna', 'Pune', 'Raipur', 'Rajkot',
    'Ranchi', 'Srinagar', 'Surat', 'Thiruvananthapuram', 'Tiruchirappalli', 'Vadodara',
    'Varanasi', 'Vijayawada', 'Visakhapatnam', 'Warangal'
].sort();

const LocationModal = ({ isOpen, onClose, selectedCity, onSelectCity }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showAllCities, setShowAllCities] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);
    const [locationError, setLocationError] = useState('');

    const filteredPopularCities = popularCities.filter(city => 
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredAllCities = allCities.filter(city => 
        city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Group all cities by first letter for the "View All" section
    const groupedCities = useMemo(() => {
        return filteredAllCities.reduce((acc, city) => {
            const letter = city[0].toUpperCase();
            if (!acc[letter]) acc[letter] = [];
            acc[letter].push(city);
            return acc;
        }, {});
    }, [filteredAllCities]);

    const handleCitySelect = (cityName) => {
        onSelectCity(cityName);
        onClose();
        setLocationError('');
    };

    const handleDetectLocation = () => {
        setIsDetecting(true);
        setLocationError('');

        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser");
            setIsDetecting(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    // Free, no-auth required reverse geocoding API
                    const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
                    const data = await response.json();
                    
                    const detectedCity = data.city || data.locality || "Unknown Location";
                    
                    if (detectedCity && detectedCity !== "Unknown Location") {
                        handleCitySelect(detectedCity);
                    } else {
                        setLocationError("Could not determine city from your location");
                    }
                } catch (error) {
                    setLocationError("Failed to fetch location details");
                } finally {
                    setIsDetecting(false);
                }
            },
            (error) => {
                setIsDetecting(false);
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        setLocationError("Location permission denied. Please allow access in your browser settings.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setLocationError("Location information is unavailable.");
                        break;
                    case error.TIMEOUT:
                        setLocationError("The request to get user location timed out.");
                        break;
                    default:
                        setLocationError("An unknown error occurred getting location.");
                        break;
                }
            },
            { timeout: 10000 } // 10 second timeout
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[100px] sm:pt-[150px]">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl z-10 overflow-hidden mx-4 animate-scale-in">
                
                {/* Search Header */}
                <div className="p-6 border-b border-gray-100 flex items-center space-x-4">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg text-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder-gray-400 transition-colors"
                            placeholder="Search for your city"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Detect Location */}
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex flex-col items-start">
                    <button 
                        onClick={handleDetectLocation}
                        disabled={isDetecting}
                        className="flex items-center space-x-2 text-primary hover:text-primary-hover font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isDetecting ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <MapPin className="h-5 w-5" />
                        )}
                        <span>{isDetecting ? "Detecting location..." : "Detect my location"}</span>
                    </button>
                    {locationError && (
                        <p className="text-red-500 text-xs mt-2 font-medium">{locationError}</p>
                    )}
                </div>

                {/* Cities Content */}
                <div className="p-6 h-[400px] overflow-y-auto custom-scrollbar">
                    
                    {!showAllCities ? (
                        /* Popular Cities View */
                        <div className="animate-fade-in">
                            <h3 className="text-center text-gray-800 font-medium mb-8">Popular Cities</h3>
                            
                            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-y-8 gap-x-2">
                                {filteredPopularCities.map((city) => (
                                    <button
                                        key={city.name}
                                        onClick={() => handleCitySelect(city.name)}
                                        className={`flex flex-col items-center justify-center space-y-3 group transition-transform hover:-translate-y-1 ${
                                            selectedCity === city.name ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                                        }`}
                                    >
                                        <div 
                                            className="w-[70px] h-[65px] transition-all opacity-80 group-hover:opacity-100"
                                            style={{
                                                backgroundImage: `url(${citiesSprite})`,
                                                backgroundSize: '1000% 210%', // 10 columns, and slightly more than 2x height to crop text
                                                backgroundPosition: `${city.bgPos} 0%`,
                                                backgroundRepeat: 'no-repeat'
                                            }}
                                        />
                                        <span className={`text-sm text-center ${selectedCity === city.name ? 'text-primary font-medium' : 'text-gray-600'}`}>
                                            {city.name}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {filteredPopularCities.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    No popular cities found matching "{searchQuery}". <br/>
                                    <button 
                                        onClick={() => setShowAllCities(true)}
                                        className="text-primary hover:underline mt-2 font-medium"
                                    >
                                        Try searching in All Cities
                                    </button>
                                </div>
                            )}

                            {!searchQuery && (
                                <div className="mt-10 text-center border-t border-gray-100 pt-6">
                                    <button 
                                        onClick={() => setShowAllCities(true)}
                                        className="text-primary hover:text-primary-hover font-medium transition-colors hover:underline"
                                    >
                                        View All Cities
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* All Cities View */
                        <div className="animate-fade-in pb-8">
                            <div className="flex items-center space-x-2 mb-6 sticky top-0 bg-white z-10 py-2 border-b border-gray-100">
                                <button 
                                    onClick={() => setShowAllCities(false)}
                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                                </button>
                                <h3 className="text-gray-800 font-medium text-lg">All Cities</h3>
                            </div>

                            <div className="space-y-6">
                                {Object.keys(groupedCities).length > 0 ? (
                                    Object.keys(groupedCities).sort().map(letter => (
                                        <div key={letter} className="flex">
                                            <div className="w-12 text-center text-xl font-bold text-gray-300 pt-1 select-none">
                                                {letter}
                                            </div>
                                            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                                {groupedCities[letter].map(city => (
                                                    <button
                                                        key={city}
                                                        onClick={() => handleCitySelect(city)}
                                                        className={`text-left text-sm py-2 px-3 rounded-md transition-colors ${
                                                            selectedCity === city 
                                                                ? 'bg-primary/10 text-primary font-medium' 
                                                                : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        {city}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        No cities found matching "{searchQuery}"
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default LocationModal;
