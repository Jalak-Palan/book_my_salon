import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Loader2, MessageSquare, ArrowRight } from 'lucide-react';

const LoginForm = ({ 
    view, 
    email, 
    setEmail, 
    password, 
    setPassword, 
    otp, 
    handleOtpChange, 
    otpRefs, 
    handlePasswordLogin, 
    handleSendOtp, 
    handleVerifyOtp, 
    setView, 
    isLoading 
}) => {
    if (view === 'EMAIL_PASS') {
        return (
            <form className="space-y-5" onSubmit={handlePasswordLogin}>
                <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="Email Address"
                    />
                </div>

                <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="Password"
                    />
                </div>

                <div className="flex justify-between items-center text-sm font-medium">
                    <button type="button" onClick={handleSendOtp} className="text-primary hover:text-primary-hover underline underline-offset-4">
                        Login with OTP Instead
                    </button>
                    <Link to="/forgot-password" title="Click here to reset your password" className="text-gray-400 hover:text-gray-600">Forgot Password?</Link>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-orange-200 flex items-center justify-center space-x-2 active:scale-[0.98]"
                >
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <span>Sign In</span>}
                </button>
            </form>
        );
    }

    return (
        <form className="space-y-6 text-center" onSubmit={handleVerifyOtp}>
            <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold">Verification Code</h3>
                <p className="text-sm text-gray-500 mb-6">Sent to {email}</p>
            </div>

            <div className="flex justify-center gap-3">
                {otp.map((digit, idx) => (
                    <input
                        key={idx}
                        ref={otpRefs[idx]}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        className="w-14 h-16 text-center text-2xl font-bold bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                    />
                ))}
            </div>

            <button
                type="submit"
                disabled={isLoading || otp.join('').length < 4}
                className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-2xl transition-all disabled:opacity-50"
            >
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Verify & Continue'}
            </button>
            
            <button type="button" onClick={() => setView('EMAIL_PASS')} className="text-gray-500 text-sm font-bold flex items-center justify-center space-x-1 mx-auto">
                <ArrowRight className="w-4 h-4 rotate-180" />
                <span>Back to Password</span>
            </button>
        </form>
    );
};

export default LoginForm;
