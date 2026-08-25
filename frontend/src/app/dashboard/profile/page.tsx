'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../../providers/AuthProvider';
import { apiFetch } from '../../../lib/api';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  bio: z.string().optional(),
  college: z.string().optional(),
  graduationYear: z.number().int().min(1900).max(2100).optional(),
  skillsInput: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, updateProfileState } = useAuth();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (user?.profile) {
      setValue('firstName', user.profile.firstName || '');
      setValue('lastName', user.profile.lastName || '');
      setValue('bio', user.profile.bio || '');
      setValue('college', user.profile.college || '');
      setValue('graduationYear', user.profile.graduationYear || undefined);
      setValue('skillsInput', user.profile.skills ? user.profile.skills.join(', ') : '');
    }
  }, [user, setValue]);

  const onSubmit = async (data: ProfileForm) => {
    setSuccess(false);
    setError(null);
    setLoading(true);

    try {
      const skills = data.skillsInput
        ? data.skillsInput.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      const updatedProfile = await apiFetch('/users/profile', {
        method: 'PUT',
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          bio: data.bio,
          college: data.college,
          graduationYear: data.graduationYear,
          skills,
        }),
      });

      updateProfileState(updatedProfile);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto overflow-y-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Profile Setup</h1>
        <p className="text-slate-400 text-sm mt-1">Configure your personal and academic credentials for matching mentors.</p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm">
          Profile updated successfully!
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">First Name</label>
            <input
              type="text"
              {...register('firstName')}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm"
            />
            {errors.firstName && <p className="text-rose-400 text-xs mt-1.5">{errors.firstName.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Last Name</label>
            <input
              type="text"
              {...register('lastName')}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm"
            />
            {errors.lastName && <p className="text-rose-400 text-xs mt-1.5">{errors.lastName.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">University / College</label>
          <input
            type="text"
            {...register('college')}
            placeholder="State University"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Graduation Year</label>
          <input
            type="number"
            {...register('graduationYear', { valueAsNumber: true })}
            placeholder="2027"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm"
          />
          {errors.graduationYear && <p className="text-rose-400 text-xs mt-1.5">{errors.graduationYear.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Bio</label>
          <textarea
            {...register('bio')}
            rows={4}
            placeholder="Tell us about yourself, interests, and aspirations..."
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Skills (Comma-separated)</label>
          <input
            type="text"
            {...register('skillsInput')}
            placeholder="React, TypeScript, Node.js, Python"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 transition-all duration-200 text-sm"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
