import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../services/api';

// Create Context
const AuthContext = createContext();

// Create Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Persist login state
    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse stored user:", e);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
    }, []);

    const sendOTP = async (email, name, role) => {
        setLoading(true);
        setError(null);
        try {
            const response = await API.post('/auth/send-otp', { email, name, role });
            return response.data;
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to send OTP';
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    };

    const verifyOTP = async (email, otp) => {
        setLoading(true);
        setError(null);
        try {
            const response = await API.post('/auth/verify-otp', { email, otp });
            const { token, user: userData } = response.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return response.data;
        } catch (err) {
            const msg = err.response?.data?.message || 'Verification failed';
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            // credentials should be { email, password } or { email, otp, name }
            const response = await API.post('/auth/login', credentials);
            const { token, user: userData } = response.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return response.data;
        } catch (err) {
            const msg = err.response?.data?.message || 'Login failed';
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    // Secure owner-only login — calls the strict /auth/owner-login endpoint
    const ownerLogin = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const response = await API.post('/auth/owner-login', credentials);
            const { token, user: userData } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return response.data;
        } catch (err) {
            const msg = err.response?.data?.message || 'Login failed';
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    };

    const setPassword = async (password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await API.post('/auth/set-password', { password });
            
            // Update local storage and context state
            const updatedUser = { ...user, isFirstLogin: false };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            
            return response.data;
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to update password';
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, sendOTP, verifyOTP, login, ownerLogin, logout, setPassword, setError }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook to use the context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
