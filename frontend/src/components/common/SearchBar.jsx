import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getSearchSuggestions } from '../../services/api';

const SearchBar = ({ initialCity = '', onSearch }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const navigate = useNavigate();
    const wrapperRef = useRef(null);

    // Debounce timer
    const timeoutRef = useRef(null);

    useEffect(() => {
        if (query.length < 2) {
            setSuggestions([]);
            return;
        }

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                // Modified: Now passing q and city to match backend requirements
                const res = await getSearchSuggestions(query);
                if (res.data.success) {
                    // Filter by city if initialCity is provided (server could also do this, but we filter for safety)
                    let filtered = res.data.data;
                    if (initialCity) {
                        filtered = filtered.filter(s => s.city && s.city.toLowerCase() === initialCity.toLowerCase());
                    }
                    setSuggestions(filtered);
                }
            } catch (err) {
                console.error('Suggestion fetch error:', err);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeoutRef.current);
    }, [query, initialCity]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleSearch = (e) => {
        e.preventDefault();
        const trimmedQuery = query.trim();
        if (!trimmedQuery) return;

        // Requirement: Prompt user to select a city before searching
        if (!initialCity && !onSearch) {
            alert('Please select a city first to search for salons in that area.');
            return;
        }

        if (onSearch) {
            onSearch(trimmedQuery);
        } else {
            const searchParams = new URLSearchParams();
            searchParams.set('search', trimmedQuery);
            if (initialCity) {
                searchParams.set('city', initialCity);
            }
            navigate(`/salon-finder?${searchParams.toString()}`);
        }
        setShowSuggestions(false);
    };

    const handleSelectSuggestion = (salon) => {
        if (onSearch) {
            onSearch(salon.name);
            setQuery(salon.name);
        } else {
            navigate(`/salon/${salon._id}`);
        }
        setShowSuggestions(false);
    };

    return (
        <div className="relative w-full max-w-2xl mx-auto" ref={wrapperRef}>
            <form onSubmit={handleSearch} className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <input
                    type="text"
                    className="w-full bg-white border-2 border-transparent focus:border-orange-100 py-4 pl-14 pr-12 rounded-3xl shadow-xl shadow-orange-100/50 outline-none text-gray-700 font-medium placeholder:text-gray-400 transition-all text-lg"
                    placeholder="Search for salons, services or cities..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                />
                {loading && (
                    <div className="absolute inset-y-0 right-14 flex items-center">
                        <Loader2 className="h-5 w-5 text-orange-500 animate-spin" />
                    </div>
                )}
                {query && (
                    <button
                        type="button"
                        onClick={() => {
                            setQuery('');
                            setSuggestions([]);
                        }}
                        className="absolute inset-y-0 right-5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && (suggestions.length > 0 || (query.length >= 2 && !loading)) && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="py-2">
                        {suggestions.length > 0 ? (
                            suggestions.map((salon) => (
                                <button
                                    key={salon._id}
                                    onClick={() => handleSelectSuggestion(salon)}
                                    className="w-full flex items-center px-5 py-3 hover:bg-orange-50 transition-colors text-left group"
                                >
                                    <div className="p-2 bg-gray-100 rounded-lg mr-4 group-hover:bg-white transition-colors">
                                        <MapPin className="h-4 w-4 text-gray-500 group-hover:text-orange-500" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-800 text-sm">{salon.name}</div>
                                        <div className="text-xs text-gray-500">{salon.city}</div>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="px-5 py-8 text-center text-gray-500">
                                <Search className="h-10 w-10 text-gray-200 mx-auto mb-2" />
                                <p className="text-sm font-medium">No salons found matching "{query}"</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
