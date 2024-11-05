'use client';

import { useState } from 'react';
import axios from 'axios';

export default function MobileLogin() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [error, setError] = useState('');

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {

        console.log("email or phone", emailOrPhone)
      const response = await axios.post(
        'https://bepocart.in/generate-otp/',
        { phone:emailOrPhone }
      );

      if (response.status === 200) {
        console.log('OTP sent successfully');
        setOtpRequested(true); // Switch to OTP input after requesting OTP
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error?.response?.data?.error || 'An error occurred. Please try again.';
      setError(errorMessage);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://bepocart.in/verification-otp/',
        { otp:otp, phone: emailOrPhone }
      );

      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        // Navigate to the home page after successful OTP verification
        window.location.href = '/';
      } else {
        setError('OTP verification was not successful.');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
      <div style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '40px', maxWidth: '400px', width: '100%', backgroundColor: '#ffffff', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '16px', color: '#333' }}>Sign In</h2>
        <p style={{ textAlign: 'center', marginBottom: '24px', color: '#666' }}>
          Access your Orders, Wishlist, and Recommendations
        </p>

        {error && (
          <p style={{ color: 'red', textAlign: 'center', marginBottom: '16px' }}>
            {error}
          </p>
        )}

        {!otpRequested ? (
          <form onSubmit={handleRequestOtp}>
            <input
              type="text"
              placeholder="Enter Mobile Number"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '16px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '16px'
              }}
            />
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#FF5722',
                color: '#ffffff',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Request OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit}>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '16px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '16px'
              }}
            />
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#4CAF50',
                color: '#ffffff',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Verify OTP
            </button>
          </form>
        )}

        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#666' }}>
          By continuing, you agree to our <a href="#" style={{ color: '#FF5722' }}>Terms of Use</a> and <a href="#" style={{ color: '#FF5722' }}>Privacy Policy</a>.
        </p>
        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#666' }}>
          New to BepoCart? <a href="#" style={{ color: '#FF5722' }}>Create an account</a>
        </p>
      </div>
    </div>
  );
}
