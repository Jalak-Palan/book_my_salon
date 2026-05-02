import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import Logo from '../../components/common/Logo';
import API from '../../services/api';
import './SalonOwnerLogin.css'; // Reusing some styles

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await API.post('/auth/forgot-password', { email });
      setStep(2);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to send OTP. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await API.post('/auth/reset-password', { email, otp, password: newPassword });
      setSuccess(true);
      setTimeout(() => {
        navigate('/owner-login');
      }, 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to reset password. Please check your OTP.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="owner-login-container">
        <div className="owner-login-card text-center p-10">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Password Reset!</h2>
          <p className="text-gray-500 mb-6 font-medium">Your password has been updated successfully. Redirecting you to login...</p>
          <Loader2 className="w-6 h-6 text-green-500 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="owner-login-container">
      <div className="owner-login-card">
        <div className="brand-header">
          <Logo size="lg" className="mb-10 mx-auto" />
          <p className="subtitle">Security Portal</p>
          <h1 className="text-xl font-black text-gray-900 mt-2">Recover Access</h1>
        </div>

        {errorMsg && (
          <div className="error-message p-3 mb-4 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center animate-fade-in">
            {errorMsg}
          </div>
        )}

        <form onSubmit={step === 1 ? handleSendOTP : handleResetPassword} className="login-form">
          {step === 1 ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 text-center mb-6">
                Enter the email address associated with your account and we'll send you an OTP to reset your password.
              </p>
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
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 text-center mb-6">
                We've sent a 4-digit code to <span className="font-bold text-gray-900">{email}</span>. Use it to set a new password.
              </p>
              <div className="input-group">
                <label htmlFor="otp">Verification Code</label>
                <div className="input-wrapper">
                  <ShieldCheck className="field-icon" size={20} />
                  <input
                    type="text"
                    id="otp"
                    placeholder="Enter 4-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="newPassword">New Password</label>
                <div className="input-wrapper">
                  <Lock className="field-icon" size={20} />
                  <input
                    type="password"
                    id="newPassword"
                    placeholder="Min 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="login-button mt-6" disabled={loading}>
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                {step === 1 ? 'Send Recovery Code' : 'Reset Password'}
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Remembered your password? <Link to="/owner-login">Back to Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
