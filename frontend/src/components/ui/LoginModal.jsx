import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, LogIn, User, ArrowRight, Loader2 } from 'lucide-react';
import Logo from '../common/Logo';
import { useAuth } from '../../context/AuthContext';

const LoginModal = ({ isOpen, onClose }) => {
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setErrorMsg('');
        } else {
            document.body.style.overflow = 'unset';
            setIsLoading(false);
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            {/* Modal Container */}
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl relative overflow-hidden animate-slide-up mx-4 border border-gray-100">
                
                {/* Visual Header */}
                <div className="bg-primary p-12 flex flex-col items-center text-white relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-orange-600 opacity-90"></div>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/60 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-20"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <Logo className="mb-6 brightness-0 invert scale-125" size="lg" />
                        <h2 className="text-3xl font-bold mb-2">Welcome!</h2>
                        <p className="text-orange-100 font-medium">Your premium grooming journey starts here.</p>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-black/10 rounded-full blur-xl"></div>
                </div>

                {/* Choice Body */}
                <div className="p-8 lg:p-10 bg-white">
                    {errorMsg && (
                        <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100 text-center">
                            {errorMsg}
                        </div>
                    )}

                    <div className="space-y-4">
                        <Link
                            to="/login"
                            onClick={onClose}
                            className="w-full flex items-center justify-between group bg-gray-50 hover:bg-white border border-gray-100 hover:border-primary p-5 rounded-2xl transition-all shadow-sm hover:shadow-md"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-colors">
                                    <LogIn className="w-6 h-6 text-primary group-hover:text-white" />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-gray-900 group-hover:text-primary transition-colors">Sign In</p>
                                    <p className="text-xs text-gray-500 font-medium">Access your existing account</p>
                                </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </Link>

                        <Link
                            to="/signup"
                            onClick={onClose}
                            className="w-full flex items-center justify-between group bg-gray-50 hover:bg-white border border-gray-100 hover:border-primary p-5 rounded-2xl transition-all shadow-sm hover:shadow-md"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
                                    <User className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-gray-900 group-hover:text-primary transition-colors">Create Account</p>
                                    <p className="text-xs text-gray-500 font-medium tracking-tight">Join the BookMySalon network</p>
                                </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </Link>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <button
                            disabled={isLoading}
                            onClick={async () => {
                                setIsLoading(true);
                                try {
                                    await login({
                                        name: 'Sneha Patel',
                                        email: 'demo_user@example.com',
                                        phone: '+91 9876543210'
                                    });
                                    onClose();
                                } catch (err) {
                                    setErrorMsg('Demo login failed');
                                } finally {
                                    setIsLoading(false);
                                }
                            }}
                            className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors inline-flex items-center space-x-2"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                            ) : (
                                <>
                                    <span>Continue as Guest (Demo)</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
