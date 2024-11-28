'use client';

import { useState, useEffect } from 'react';
import Input from '@components/ui/form/input';
import PasswordInput from '@components/ui/form/password-input';
import Button from '@components/ui/button';
import { useForm } from 'react-hook-form';
import { useLoginMutation, LoginInputType } from '@framework/auth/use-login';
import { useTranslation } from 'src/app/i18n/client';
import Image from '@components/ui/image';
import { useModalAction } from '@components/common/modal/modal.context';
import Switch from '@components/ui/switch';
import CloseButton from '@components/ui/close-button';
import { FaGoogle } from 'react-icons/fa';
import cn from 'classnames';
import Link from 'next/link';
import { signIn, getSession } from 'next-auth/react'; 
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
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
  const { mutate: login, isLoading } = useLoginMutation();
  const [remember, setRemember] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputType>();

 
  function onSubmit({ email, password }: LoginInputType) {
    login({
      email,
      password,
    });
  
    axios
      .post("http://72.167.55.172:8000/manual-login", { email, password })
      .then((response) => {
        const token = response.data?.token;
  
        if (token) {
          localStorage.setItem("token", token);
  
          // Decode the token to extract the user ID
          const decodedToken = jwtDecode(token);
          const userId = decodedToken?.id;
  
          // Push data to the GTM dataLayer
          if (typeof window !== "undefined" && window.dataLayer) {
            window.dataLayer.push({
              event: "login",
              login_method: "email-password",
              user_id: userId || "unknown",
            });
          }
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
      });
  
    closeModal();
  }
  





  function handleSignUp() {
    return openModal('SIGN_UP_VIEW');
  }

  function handleForgetPassword() {
    return openModal('FORGET_PASSWORD');
  }

  async function handleGoogleLogin() {
    try {
      const result = await signIn('google', { redirect: false });
  
      if (result?.error) {
        setMessage(result.error);
        setMessageType('error');
      }
    } catch (error) {
      console.error("Error during Google login:", error);
      setMessage("Google login failed");
      setMessageType('error');
    }
  }

  useEffect(() => {
    async function checkSessionAndSendToken() {
      const session = await getSession();
      if (session?.user) {
        const { name, email } = session.user;
  
        try {
          const response = await axios.post('http://72.167.55.172:8000/google-login/', { name, email });
          const token = response.data?.token;
  
          if (token) {
            // Save the token in localStorage
            localStorage.setItem("token", token);
  
            // Decode the token to extract the user ID
            const decodedToken = jwtDecode(token);
            const userId = decodedToken?.id; // Replace 'id' with the actual field from your token
  
            // Push data to the GTM dataLayer
            if (typeof window !== 'undefined' && window.dataLayer) {
              window.dataLayer.push({
                event: "login",
                login_method: "Google",
                user_id: userId || "unknown",
              });
            }
  
            setMessageType("success");
          } else {
            setMessage("Failed to retrieve token from backend.");
            setMessageType("error");
          }
        } catch (backendError) {
          console.error("Backend error:", backendError);
          setMessage("Failed to communicate with backend.");
          setMessageType("error");
        }
      }
    }
  
    checkSessionAndSendToken();
  }, []);
  
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
            <div className="mt-3 text-sm text-center text-body">
              {t('common:text-don’t-have-account')}
              <button
                type="button"
                className="text-sm text-brand hover:no-underline focus:outline-none"
                onClick={handleSignUp}
              >
                {t('common:text-create-account')}
              </button>
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col space-y-3.5">
              <Input
                label="email"
                type="email"
                style={{ color: "black" }}
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
                <label className="relative inline-block cursor-pointer switch">
                  <Switch checked={remember} onChange={setRemember} />
                </label>
                <button
                  type="button"
                  onClick={handleForgetPassword}
                  className="text-sm text-heading hover:text-brand-dark focus:outline-none"
                >
                  {t('common:text-forgot-password')}
                </button>
              </div>
              <Button type="submit" loading={isLoading} disabled={isLoading} className="w-full">
                Login Now
              </Button>
            </div>
          </form>

          <div className="flex flex-col items-center mt-6">
            <span className="text-sm text-brand-dark opacity-70">
              {t('common:text-or')}
            </span>
            {/* Enhanced Google Login Button */}
            <button
              className="flex items-center justify-center w-full mt-4 px-4 py-3 border border-gray-300 rounded-lg bg-white text-brand-dark shadow-md hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105"
              onClick={handleGoogleLogin}
            >
              <FaGoogle className="w-6 h-6 mr-2" />
              <span className="text-base font-medium">Sign in with Google</span>
            </button>

            {/* Login with OTP Button */}
            <Link href="/en/mobilelogin">
              <button
                onClick={() => closeModal()} // Close the modal when the button is clicked
                className="flex items-center justify-center w-full mt-4 px-4 py-3 border border-gray-300 rounded-lg bg-white text-brand-dark shadow-md hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105"
              >
                <span className="text-base font-medium">Login with OTP</span>
              </button>
            </Link>
          </div>

          {message && (
            <p className={`mt-4 ${messageType === "error" ? "text-red-500" : "text-green-500"}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
