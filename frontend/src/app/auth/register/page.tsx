'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../../providers/AuthProvider';
import Link from 'next/link';

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['STUDENT', 'MENTOR', 'PLACEMENT_COORDINATOR']),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: authRegister } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'STUDENT',
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    setError(null);
    setLoadingState(true);
    try {
      await authRegister(data.email, data.password, data.firstName, data.lastName, data.role);
    } catch (err: any) {
      setError(err.message || 'Failed to register account');
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow spots */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />

      <div className="w-full max-w-lg bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-violet-300">
            CampusOS
          </Link>
          <p className="text-sm text-slate-400 mt-2">Create your student or mentor account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">First Name</label>
              <input
                type="text"
                {...register('firstName')}
                placeholder="Jane"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm"
              />
              {errors.firstName && <p className="text-rose-400 text-xs mt-1.5">{errors.firstName.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Last Name</label>
              <input
                type="text"
                {...register('lastName')}
                placeholder="Doe"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm"
              />
              {errors.lastName && <p className="text-rose-400 text-xs mt-1.5">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              {...register('email')}
              placeholder="jane.doe@university.edu"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm"
            />
            {errors.email && <p className="text-rose-400 text-xs mt-1.5">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              {...register('password')}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm"
            />
            {errors.password && <p className="text-rose-400 text-xs mt-1.5">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Account Type / Role</label>
            <select
              {...register('role')}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-indigo-500/50 transition-colors text-sm"
            >
              <option value="STUDENT">Student</option>
              <option value="MENTOR">Mentor</option>
              <option value="PLACEMENT_COORDINATOR">Placement Coordinator</option>
            </select>
            {errors.role && <p className="text-rose-400 text-xs mt-1.5">{errors.role.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loadingState}
            className="w-full py-3.5 rounded-xl font-medium bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 transition-all duration-200 text-sm mt-4"
          >
            {loadingState ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-8">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-indigo-400 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
