'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../../providers/AuthProvider';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: authRegister, googleLogin } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setError(null);
    setLoadingState(true);
    try {
      await authRegister(data.email, data.password, data.firstName, data.lastName);
    } catch (err: any) {
      setError(err.message || 'Failed to register account');
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-[#121212] flex items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-[#FF5722]/30 selection:text-white">
      
      {/* Back Button */}
      <Link 
        href="/#top" 
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-[#AAAAAA] hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back to Home</span>
      </Link>

      {/* Background glow spots */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#FF5722]/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#FF5722]/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="w-full max-w-lg bg-[#1E1E1E] border border-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-extrabold text-white tracking-tight">
            CampusOS
          </Link>
          <p className="text-sm text-[#AAAAAA] mt-2">Create your student or mentor account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
            {error}
          </div>
        )}

        <div className="mb-6 flex justify-center">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              if (credentialResponse.credential) {
                setError(null);
                setLoadingState(true);
                try {
                  await googleLogin(credentialResponse.credential);
                } catch (err: any) {
                  setError(err.message || 'Google authentication failed');
                  setLoadingState(false);
                }
              }
            }}
            onError={() => {
              setError('Google authentication failed');
            }}
            shape="rectangular"
            theme="filled_black"
            text="continue_with"
          />
        </div>

        <div className="flex items-center mb-6">
          <div className="flex-1 border-t border-white/10"></div>
          <span className="px-4 text-xs text-[#AAAAAA] uppercase tracking-wider">or register with email</span>
          <div className="flex-1 border-t border-white/10"></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#AAAAAA] uppercase tracking-wider mb-2">First Name</label>
              <input
                type="text"
                {...register('firstName')}
                placeholder="Jane"
                className="w-full px-4 py-3 rounded-xl bg-[#242424] border border-white/10 text-white placeholder-[#AAAAAA]/50 focus:outline-none focus:border-[#FF5722]/50 transition-colors text-sm"
              />
              {errors.firstName && <p className="text-rose-400 text-xs mt-1.5">{errors.firstName.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#AAAAAA] uppercase tracking-wider mb-2">Last Name</label>
              <input
                type="text"
                {...register('lastName')}
                placeholder="Doe"
                className="w-full px-4 py-3 rounded-xl bg-[#242424] border border-white/10 text-white placeholder-[#AAAAAA]/50 focus:outline-none focus:border-[#FF5722]/50 transition-colors text-sm"
              />
              {errors.lastName && <p className="text-rose-400 text-xs mt-1.5">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#AAAAAA] uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              {...register('email')}
              placeholder="jane.doe@university.edu"
              className="w-full px-4 py-3 rounded-xl bg-[#242424] border border-white/10 text-white placeholder-[#AAAAAA]/50 focus:outline-none focus:border-[#FF5722]/50 transition-colors text-sm"
            />
            {errors.email && <p className="text-rose-400 text-xs mt-1.5">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#AAAAAA] uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              {...register('password')}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-[#242424] border border-white/10 text-white placeholder-[#AAAAAA]/50 focus:outline-none focus:border-[#FF5722]/50 transition-colors text-sm"
            />
            {errors.password && <p className="text-rose-400 text-xs mt-1.5">{errors.password.message}</p>}
          </div>



          <button
            type="submit"
            disabled={loadingState}
            className="w-full py-3.5 rounded-xl font-medium bg-[#FF5722] hover:bg-[#FF6B00] text-white shadow-lg shadow-[#FF5722]/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 transition-all duration-200 text-sm mt-4"
          >
            {loadingState ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-xs text-[#AAAAAA] mt-8">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-[#FF5722] hover:underline font-medium">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
