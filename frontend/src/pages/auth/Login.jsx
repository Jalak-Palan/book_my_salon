import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import Logo from '../../components/common/Logo';
import LoginForm from './components/LoginForm';

const Login = () => {
    const { login, sendOTP, verifyOTP } = useAuth();
    const navigate = useNavigate();
    const [view, setView] = useState('EMAIL_PASS');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState(['', '', '', '']);
    const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

    const handlePasswordLogin = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setIsLoading(true);
        try {
            await login({ email, password });
            navigate('/dashboard');
        } catch (error) {
            setErrorMsg(error.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendOtp = async () => {
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setErrorMsg('Please enter a valid email to receive OTP.');
            return;
        }
        setErrorMsg('');
        setIsLoading(true);
        try {
            await sendOTP(email);
            setView('OTP_VERIFY');
        } catch (error) {
            setErrorMsg(error.message || 'Failed to send OTP.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length !== 4) return;

        setIsLoading(true);
        try {
            await verifyOTP(email, otpString);
            navigate('/dashboard');
        } catch (error) {
            setErrorMsg(error.message || 'Invalid OTP.');
            setOtp(['', '', '', '']);
            otpRefs[0].current?.focus();
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        const val = value.replace(/\D/g, '').slice(-1);
        const newOtp = [...otp];
        newOtp[index] = val;
        setOtp(newOtp);
        if (val && index < 3) otpRefs[index + 1].current?.focus();
    };

    const googleLoginByPage = useGoogleLogin({
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
                setErrorMsg('Google login failed.');
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
            <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
                
                <div className="hidden md:flex md:w-1/2 bg-gray-900 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-primary/40 opacity-90"></div>
                    <div className="relative z-10 p-12 flex flex-col justify-center text-white h-full">
                        <Logo className="mb-8 brightness-0 invert" size="lg" />
                        <h2 className="text-4xl font-bold mb-6 italic tracking-tight">Welcome Back.</h2>
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                            Sign in to manage your appointments, discover new styles, and connect with your favorite salon professionals.
                        </p>
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                <KeyRound className="w-6 h-6 text-primary" />
                                <div>
                                    <p className="font-bold">Secure Access</p>
                                    <p className="text-sm text-gray-400">Industry-standard encryption</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/2 p-8 lg:p-12">
                    <div className="text-center md:text-left mb-10">
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Sign In</h1>
                        <p className="mt-2 text-gray-500 font-medium tracking-wide">Enter your credentials to continue</p>
                    </div>

                    {errorMsg && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg flex items-center">
                            <span className="font-bold mr-2">Error:</span> {errorMsg}
                        </div>
                    )}

                    <LoginForm 
                        view={view}
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        otp={otp}
                        handleOtpChange={handleOtpChange}
                        otpRefs={otpRefs}
                        handlePasswordLogin={handlePasswordLogin}
                        handleSendOtp={handleSendOtp}
                        handleVerifyOtp={handleVerifyOtp}
                        setView={setView}
                        isLoading={isLoading}
                    />

                    <div className="mt-8 flex flex-col items-center space-y-6">
                        <div className="w-full flex items-center justify-center space-x-4">
                            <div className="flex-1 h-px bg-gray-200"></div>
                            <span className="text-xs text-gray-400 font-bold tracking-widest uppercase">Or Continue With</span>
                            <div className="flex-1 h-px bg-gray-200"></div>
                        </div>

                        <button
                            onClick={() => googleLoginByPage()}
                            className="w-full flex items-center justify-center space-x-3 bg-white border border-gray-300 hover:border-gray-900 py-3.5 rounded-2xl font-bold text-gray-700 transition-all active:scale-[0.98]"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            <span>Google Account</span>
                        </button>

                        <p className="text-gray-600 font-medium">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-primary hover:text-primary-hover font-bold decoration-2 underline-offset-4 hover:underline">
                                Sign Up Now
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
