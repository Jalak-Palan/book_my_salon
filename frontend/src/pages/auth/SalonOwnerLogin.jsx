import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Scissors, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/common/Logo';
import axios from 'axios';
import './SalonOwnerLogin.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const SalonOwnerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const { ownerLogin, sendOTP, loading } = useAuth();
  const [errorMsg, setErrorMsg] = useState('');

  const handleSendOTP = async () => {
    if (!email) {
      setErrorMsg('Please enter your email first');
      return;
    }
    setErrorMsg('');
    try {
      await sendOTP(email, null, 'salon_owner');
      setOtpSent(true);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send OTP');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const credentials = { email, role: 'salon_owner' };
      if (loginMethod === 'password') {
        credentials.password = password;
      } else {
        credentials.otp = otp;
      }

      const result = await ownerLogin(credentials);
      const token = result?.token || localStorage.getItem('token');
      const isFirstLogin = result?.user?.isFirstLogin;

      if (isFirstLogin) {
        navigate('/create-password');
        return;
      }

      // Check if owner already completed onboarding
      try {
        const detailsRes = await axios.get(`${API_URL}/api/owner-details/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (detailsRes.data?.data) {
          navigate('/owner-dashboard');  // already onboarded
        } else {
          navigate('/salon-onboarding'); // first time — setup needed
        }
      } catch {
        navigate('/salon-onboarding');   // error fetching → assume not set up
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="owner-login-container">
      <div className="owner-login-card">
        <div className="brand-header">
          <Logo size="lg" className="mb-10 mx-auto" />
          <p className="subtitle">Partner Portal</p>
        </div>

        <div className="login-method-toggle">
          <button 
            className={`method-btn ${loginMethod === 'password' ? 'active' : ''}`}
            onClick={() => { setLoginMethod('password'); setErrorMsg(''); }}
          >
            Password
          </button>
          <button 
            className={`method-btn ${loginMethod === 'otp' ? 'active' : ''}`}
            onClick={() => { setLoginMethod('otp'); setErrorMsg(''); }}
          >
            OTP Login
          </button>
        </div>

        {errorMsg && (
          <div className="error-message p-3 mb-4 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center animate-fade-in">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <Mail className="field-icon" size={20} />
              <input
                type="email"
                id="email"
                placeholder="salon@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {loginMethod === 'password' ? (
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock className="field-icon" size={20} />
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          ) : (
            <div className="input-group">
              <label htmlFor="otp">Enter OTP</label>
              <div className="input-wrapper flex gap-2">
                <div className="relative flex-1">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    id="otp"
                    placeholder="4-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required={loginMethod === 'otp'}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none"
                  />
                </div>
                {!otpSent ? (
                  <button 
                    type="button" 
                    onClick={handleSendOTP}
                    className="px-4 bg-orange-50 text-primary font-bold text-xs rounded-xl hover:bg-orange-100 transition-colors shrink-0"
                  >
                    Send OTP
                  </button>
                ) : (
                  <button 
                    type="button" 
                    onClick={handleSendOTP}
                    className="px-4 text-gray-400 font-bold text-[10px] rounded-xl hover:text-primary transition-colors shrink-0"
                  >
                    Resend?
                  </button>
                )}
              </div>
              {otpSent && <p className="text-[10px] text-green-600 mt-2 font-medium">OTP sent to your email!</p>}
            </div>
          )}

          <div className="form-footer">
            {loginMethod === 'password' && (
              <Link to="/forgot-password" stroke="currentColor" className="forgot-password">
                Forgot Password?
              </Link>
            )}
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                {loginMethod === 'otp' ? 'Verify & Login' : 'Login to Dashboard'}
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Not a partner yet? <Link to="/partner-registration">Join BookMySalon</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SalonOwnerLogin;
