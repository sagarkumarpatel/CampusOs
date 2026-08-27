'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../../providers/AuthProvider';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    setLoadingState(true);
    try {
      await login(data.email, data.password);
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate');
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

      <div className="w-full max-w-md bg-[#1E1E1E] border border-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-extrabold text-white tracking-tight">
            CampusOS
          </Link>
          <p className="text-sm text-[#AAAAAA] mt-2">Sign in to your student profile</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[#AAAAAA] uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              {...register('email')}
              placeholder="you@university.edu"
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
            {loadingState ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-[#AAAAAA] mt-8">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="text-[#FF5722] hover:underline font-medium">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
