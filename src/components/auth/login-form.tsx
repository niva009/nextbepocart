'use client';

import { useState } from 'react';
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
import { signIn } from 'next-auth/react';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

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
    closeModal();
  }

  function handleSignUp() {
    return openModal('SIGN_UP_VIEW');
  }

  function handleForgetPassword() {
    return openModal('FORGET_PASSWORD');
  }

  // Handle Google Sign-In with a custom function
  const handleGoogleLogin = async () => {
    try {
      const result = await signIn('google', { redirect: false });
      if (result?.error) {
        throw new Error(result.error);
      }

      // Retrieve session to access the token
      const response = await fetch('/api/auth/session');
      const session = await response.json();

      if (session && session.accessToken) {
        const idToken = session.accessToken;

        // Decode the Google ID token to extract user info
        const decodedIdToken = jwtDecode(idToken);
        const { name, email } = decodedIdToken;

        console.log("Decoded user information:", name, email);

        // Send the user information to your backend to get your app's token
        const backendResponse = await axios.post('https://bepocart.in/google-login/', {
          name,
          email,
        });
        const backendToken = backendResponse.data.token;

        // Store the token in localStorage
        localStorage.setItem("token", backendToken);

        // Set success message
        setMessageType("success");
        setMessage("Login successful!");

        // Redirect the user after successful login
        window.location.href = '/';
      } else {
        throw new Error("Failed to retrieve access token from session.");
      }
    } catch (error) {
      console.error("Google login error:", error);
      setMessageType("error");
      setMessage("Google login failed. Please try again.");
    }
  };

  return (
    <div
      className={cn(
        'w-full md:w-[720px] lg:w-[920px] xl:w-[1000px] 2xl:w-[1200px] relative',
        className
      )}
    >
      {isPopup === true && <CloseButton onClick={closeModal} />}

      <div className="flex mx-auto overflow-hidden rounded-lg bg-brand-light">
        <div className="md:w-1/2 lg:w-[55%] xl:w-[60%] registration hidden md:block relative">
          <Image src="/assets/images/login.jpg" alt="signin" width={718} height={600} />
        </div>
        <div className="w-full md:w-1/2 lg:w-[45%] xl:w-[40%] py-6 sm:py-10 px-4 sm:px-8 md:px-6 lg:px-8 xl:px-12 rounded-md flex flex-col justify-center">
          <div className="mb-6 text-center">
            <h4 className="text-xl font-semibold text-brand-dark sm:text-2xl sm:pt-3 ">
              {t('common:text-welcome-back')}
            </h4>
            <div className="mt-3 mb-1 text-sm text-center sm:text-15px text-body">
              {t('common:text-don’t-have-account')}
              <button
                type="button"
                className="text-sm text-brand sm:text-15px ltr:ml-1 rtl:mr-1 hover:no-underline focus:outline-none"
                onClick={handleSignUp}
              >
                {t('common:text-create-account')}
              </button>
            </div>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col justify-center"
            noValidate
          >
            <div className="flex flex-col space-y-3.5">
              <Input
                label="email"
                type="email"
                variant="solid"
                {...register('email', {
                  required: `${t('forms:email-required')}`,
                  pattern: {
                    value:
                      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
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
              <div className="flex items-center justify-center">
                <div className="flex items-center shrink-0">
                  <label className="relative inline-block cursor-pointer switch">
                    <Switch checked={remember} onChange={setRemember} />
                  </label>
                  <label
                    onClick={() => setRemember(!remember)}
                    className="mt-1 text-sm cursor-pointer shrink-0 text-heading ltr:pl-2.5 rtl:pr-2.5"
                  >
                    {t('forms:label-remember-me')}
                  </label>
                </div>
                <div className="flex ltr:ml-auto rtl:mr-auto mt-[3px]">
                  <button
                    type="button"
                    onClick={handleForgetPassword}
                    className="text-sm ltr:text-right rtl:text-left text-heading ltr:pl-3 lg:rtl:pr-3 hover:no-underline hover:text-brand-dark focus:outline-none focus:text-brand-dark"
                  >
                    {t('common:text-forgot-password')}
                  </button>
                </div>
              </div>
              <div className="relative">
                <Button
                  type="submit"
                  loading={isLoading}
                  disabled={isLoading}
                  className="w-full mt-2 tracking-normal h-11 md:h-12 font-15px md:font-15px"
                  variant="formButton"
                >
                  {t('common:text-sign-in')}
                </Button>
              </div>
            </div>
          </form>

          <div className="relative flex flex-col items-center justify-center mt-6">
            <span className="text-sm text-brand-dark opacity-70">
              {t('common:text-or')}
            </span>
            <button
              className="flex items-center justify-center w-full mt-4 h-11 md:h-12 border rounded-md bg-white text-brand-dark hover:bg-gray-100 focus:outline-none"
              onClick={handleGoogleLogin}
            >
              <FaGoogle className="w-5 h-5 mr-2" />
              Sign in with Google
            </button>
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
