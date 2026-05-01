/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const [selectedCity, setSelectedCity] = useState("Ahmedabad");

    return (
        <LocationContext.Provider value={{ selectedCity, setSelectedCity }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error("useLocation must be used within a LocationProvider");
    }
    return context;
};
