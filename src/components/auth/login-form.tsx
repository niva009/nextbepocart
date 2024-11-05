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
import Link from 'next/link'

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
  

  return (
    <div className={cn('w-full relative', className)}>
      {isPopup && <CloseButton onClick={closeModal} />}

      <div className="flex mx-auto overflow-hidden rounded-lg bg-brand-light">
        <div className="md:w-1/2 registration hidden md:block relative">
          <Image src="/assets/images/login.jpg" alt="signin" width={718} height={600} />
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
                {t('common:text-sign-in')}
              </Button>
            </div>
          </form>

          <div className="flex flex-col items-center mt-6">
            <span className="text-sm text-brand-dark opacity-70">
              {t('common:text-or')}
            </span>
            <button
              className="flex items-center justify-center w-full mt-4 border rounded-md bg-white text-brand-dark hover:bg-gray-100"
              // onClick={handleGoogleLogin}
            >
              <FaGoogle className="w-5 h-5 mr-2" />
              Sign in with Google
            </button>

         <Link href="/en/mobilelogin">
            <button
              className="flex items-center justify-center w-full mt-4 border rounded-md bg-white text-brand-dark hover:bg-gray-100"
            >
              Login with Otp
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
