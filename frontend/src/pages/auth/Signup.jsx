import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import Logo from '../../components/common/Logo';
import SignupForm from './components/SignupForm';

const Signup = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (formData.password !== formData.confirmPassword) {
            setErrorMsg('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            await login({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            navigate('/dashboard');
        } catch (error) {
            setErrorMsg(error.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const googleLoginBySignup = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setIsLoading(true);
            try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const profile = await res.json();
                await login({
                    name: profile.name,
                    email: profile.email,
                    picture: profile.picture,
                });
                navigate('/dashboard');
            } catch (error) {
                console.error('Google signup failed:', error);
                setErrorMsg('Google Sign Up failed. Please try again.');
            } finally {
                setIsLoading(false);
            }
        },
        onError: (error) => {
            console.error('Google OAuth Error:', error);
            setIsLoading(false);
        },
    });

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
                
                <div className="hidden md:flex md:w-1/2 bg-primary relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-orange-600 opacity-90"></div>
                    <div className="relative z-10 p-12 flex flex-col justify-center text-white h-full">
                        <Logo className="mb-8 brightness-0 invert" size="lg" />
                        <h2 className="text-4xl font-bold mb-6">Join the Elite Salon Network</h2>
                        <p className="text-orange-100 text-lg mb-8 leading-relaxed">
                            Discover the best salons, book instantly, and experience premium grooming services designed just for you.
                        </p>
                        <ul className="space-y-4">
                            {[
                                'Instant Online Booking',
                                'Premium Partner Network',
                                'Exclusive Member Offers',
                                'Real-time Slot Availability'
                            ].map((item, i) => (
                                <li key={i} className="flex items-center space-x-3 text-orange-50">
                                    <CheckCircle2 className="w-5 h-5 text-white/80" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="w-full md:w-1/2 p-8 lg:p-12">
                    <div className="text-center md:text-left mb-10">
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create Account</h1>
                        <p className="mt-2 text-gray-500 font-medium">Get started with your grooming journey</p>
                    </div>

                    {errorMsg && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg flex items-center">
                            <span className="font-bold mr-2">Error:</span> {errorMsg}
                        </div>
                    )}

                    <SignupForm 
                        formData={formData}
                        handleChange={handleChange}
                        handleSignup={handleSignup}
                        isLoading={isLoading}
                    />

                    <div className="mt-8 flex flex-col items-center space-y-6">
                        <div className="w-full flex items-center justify-center space-x-4">
                            <div className="flex-1 h-px bg-gray-200"></div>
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Or Register With</span>
                            <div className="flex-1 h-px bg-gray-200"></div>
                        </div>

                        <button
                            onClick={() => googleLoginBySignup()}
                            className="w-full flex items-center justify-center space-x-3 bg-white border border-gray-300 hover:border-gray-900 py-3.5 rounded-2xl font-bold text-gray-700 transition-all shadow-sm active:scale-[0.98]"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            <span>Sign up with Google</span>
                        </button>

                        <p className="text-gray-600 font-medium">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary hover:text-primary-hover font-bold decoration-2 underline-offset-4 hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
