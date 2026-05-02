import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/common/Logo';
import './SalonOwnerLogin.css';

const CreatePassword = () => {
  const [password, setPasswordState] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { user, setPassword, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not logged in or doesn't need to change password, redirect
    if (!user) {
      navigate('/owner-login');
    } else if (!user.isFirstLogin) {
      navigate('/owner-dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    try {
      await setPassword(password);
      // setPassword will update context, the effect above will redirect to /owner-dashboard
      // or we can manually navigate here
      navigate('/owner-dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update password. Please try again.');
    }
  };

  if (!user || !user.isFirstLogin) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="owner-login-container">
      <div className="owner-login-card">
        <div className="brand-header">
          <Logo size="lg" className="mb-10 mx-auto" />
          <h1>Welcome, {user.name}!</h1>
          <p className="subtitle" style={{ textTransform: 'none', marginTop: '10px' }}>
            As this is your first login, please create a secure password for your account.
          </p>
        </div>

        {errorMsg && (
          <div className="error-message p-3 mb-6 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center animate-fade-in">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="password">New Password</label>
            <div className="input-wrapper">
              <Lock className="field-icon" size={20} />
              <input
                type="password"
                id="password"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPasswordState(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: '32px' }}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <Lock className="field-icon" size={20} />
              <input
                type="password"
                id="confirmPassword"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Save & Continue
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePassword;
