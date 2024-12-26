'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {jwtDecode} from 'jwt-decode'; // Corrected import for jwtDecode

export default function MobileLogin() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [error, setError] = useState('');
  const fullUrl = localStorage.getItem("full-url")

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://bepocart.in/generate-otp/', {
        phone: emailOrPhone,
      });

      if (response.status === 200) {
        console.log('OTP sent successfully');
        setOtpRequested(true); // Switch to OTP input after requesting OTP
        toast.success('OTP sent successfully!', { autoClose: 1500 });
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch (err: any) {
      console.error(err);
      const errorMessage =
        err.response?.data?.error || 'An error occurred. Please try again.';
      setError(errorMessage);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://bepocart.in/verification-otp/', {
        otp,
        phone: emailOrPhone,
      });

      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem('token', token);

        // Decode the token to extract user ID
        const decodedToken: any = jwtDecode(token);
        const userId = decodedToken?.id;

        // Push data to the GTM dataLayer
        if (typeof window !== 'undefined' && window.dataLayer) {
          window.dataLayer.push({
            event: 'login',
            login_method: 'mobile-login',
            user_id: userId || 'unknown',
          });
        }

        toast.success('Login successful!', {
          progressClassName: 'fancy-progress-bar',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Redirect to home page after successful OTP verification
        setTimeout(() => {
          window.location.href = fullUrl || '/';
        }, 1500);
      } else {
        setError('OTP verification was not successful.');
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || 'An error occurred. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <div
        style={{
          border: '1px solid #ddd',
          borderRadius: '12px',
          padding: '40px',
          maxWidth: '400px',
          width: '100%',
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '16px', color: '#333' }}>
          Sign In
        </h2>
        <p
          style={{
            textAlign: 'center',
            marginBottom: '24px',
            color: '#666',
          }}
        >
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
                fontSize: '16px',
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
                fontWeight: 'bold',
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
                fontSize: '16px',
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
                fontWeight: 'bold',
              }}
            >
              Verify OTP
            </button>
          </form>
        )}

        <p
          style={{
            textAlign: 'center',
            marginTop: '16px',
            fontSize: '14px',
            color: '#666',
          }}
        >
          By continuing, you agree to our{' '}
          <a href="#" style={{ color: '#FF5722' }}>
            Terms of Use
          </a>{' '}
          and{' '}
          <a href="#" style={{ color: '#FF5722' }}>
            Privacy Policy
          </a>
          .
        </p>
        <p
          style={{
            textAlign: 'center',
            marginTop: '16px',
            fontSize: '14px',
            color: '#666',
          }}
        >
          New to BepoCart?{' '}
          <a href="#" style={{ color: '#FF5722' }}>
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
}
