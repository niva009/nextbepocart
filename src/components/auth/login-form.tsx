'use client';

import { useState, useEffect } from 'react';
import Input from '@components/ui/form/input';
import PasswordInput from '@components/ui/form/password-input';
import Button from '@components/ui/button';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'src/app/i18n/client';
import Image from '@components/ui/image';
import { useModalAction } from '@components/common/modal/modal.context';
import Switch from '@components/ui/switch';
import CloseButton from '@components/ui/close-button';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Link from 'next/link';
import cn from 'classnames';

interface LoginFormProps {
  lang: string;
  isPopup?: boolean;
  className?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  lang,
  isPopup = true,
  className,
}) => {
  const { t } = useTranslation(lang);
  const { closeModal, openModal } = useModalAction();
  const [remember, setRemember] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [isLoading, setIsLoading] = useState(false); // Button loading state
  const [fullUrl, setFullUrl] = useState('/'); // Fallback to '/' if localStorage is not defined

  // Retrieve full URL from localStorage in the client environment
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedFullUrl = localStorage.getItem('full-url');
      setFullUrl(storedFullUrl || '/'); // Fallback to '/' if not present
    }
  }, []);

  console.log('Full URL info:', fullUrl);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Handle manual login with email and password
  async function onSubmit({ email, password }: { email: string; password: string }) {
    setIsLoading(true);
    try {
      const response = await axios.post('https://patrick-north-power-fence.trycloudflare.com/login/', { email, password });
      const token = response.data?.token;

      if (token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
        }
        setMessageType('success');
        setMessage('Login successful!');
        closeModal();

        // Redirect to the full URL or home page
        window.location.href = fullUrl;
      } else {
        setMessageType('error');
        setMessage('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessageType('error');
      setMessage('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  // Handle Google Login Success
  const handleGoogleLoginSuccess = async (response: any) => {
    try {
      const idToken = response.credential; // Google ID Token
      const decodedIdToken: any = jwtDecode(idToken); // Decode JWT to get user info
      const { name, email } = decodedIdToken;

      // Send user data to the backend for token generation
      const result = await axios.post('https://patrick-north-power-fence.trycloudflare.com/google-login/', {
        name,
        email,
      });

      const token = result.data?.token;
      if (token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
        }
        setMessageType('success');
        setMessage('Login successful!');
        closeModal();

        // Redirect to the full URL or home page
        window.location.href = fullUrl;
      } else {
        throw new Error('Failed to retrieve token from backend.');
      }
    } catch (error) {
      console.error('Google login error:', error);
      setMessageType('error');
      setMessage('Google login failed. Please try again.');
    }
  };

  // Handle Google Login Failure
  const handleGoogleLoginFailure = (error: any) => {
    console.error('Google login failed:', error);
    setMessageType('error');
    setMessage('Google login failed. Please try again.');
  };

  return (
    <div className={cn('w-full relative', className)}>
      {isPopup && <CloseButton onClick={closeModal} />}
      <div className="flex mx-auto overflow-hidden rounded-lg bg-brand-light">
        <div className="md:w-1/2 registration hidden md:block relative">
          <Image src="/assets/images/login.png" alt="signin" width={718} height={600} />
        </div>
        <div className="w-full md:w-1/2 py-6 px-4 rounded-md flex flex-col justify-center">
          <div className="mb-6 text-center">
            <h4 className="text-xl font-semibold text-brand-dark sm:text-2xl">
              {t('common:text-welcome-back')}
            </h4>
          </div>

          {/* Social Login Options */}
          <div className="flex flex-col items-center space-y-4 mb-6">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginFailure}
            />
            <Link href="/en/mobilelogin">
              <button
                onClick={() => closeModal()}
                className="flex items-center justify-center w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-brand-dark shadow-md hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105"
              >
                <span className="text-base font-medium">Login with Mobile Number</span>
              </button>
            </Link>
          </div>

          {/* Email and Password Login */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col space-y-3.5">
              <Input
                label="email"
                style={{color:"black"}}
                type="email"
                {...register('email', {
                  required: `${t('forms:email-required')}`,
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: t('forms:email-error'),
                  },
                })}
                error={errors.email?.message}
                lang={lang}
              />
              <PasswordInput
                label="password"
                error={errors.password?.message}
                {...register('password', {
                  required: `${t('forms:password-required')}`,
                })}
                lang={lang}
              />
              <div className="flex items-center justify-between">
              <span className="text-sm text-body">
  <Link href="/en/signup" onClick={() => closeModal()} className="text-brand hover:underline">
    Register Now
  </Link>
</span>


                <button
                  type="button"
                  className="text-sm text-heading hover:text-brand-dark focus:outline-none"
                  onClick={() => openModal('FORGET_PASSWORD')}
                >
                  {t('common:text-forgot-password')}
                </button>
              </div>
              <Button type="submit" loading={isLoading} disabled={isLoading} className="w-full">
                Login Now
              </Button>
            </div>
          </form>

          {message && (
            <p className={`mt-4 ${messageType === 'error' ? 'text-red-500' : 'text-green-500'}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
