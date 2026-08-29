'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../providers/AuthProvider';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../../../lib/api';
import { Shield, ShieldOff, Search, Key, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UsersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [passwordForm, setPasswordForm] = useState({ newPassword: '', show: false });
  const [passwordStatus, setPasswordStatus] = useState<{ error?: string; success?: string } | null>(null);

  const isCoordinator = user?.roles?.includes('PLACEMENT_COORDINATOR');

  const { data: users, isLoading } = useQuery<any[]>({
    queryKey: ['all-users'],
    queryFn: () => apiFetch('/users'),
    enabled: !!isCoordinator,
  });

  const assignMentor = useMutation({
    mutationFn: (id: string) => apiFetch(`/users/${id}/mentor`, { method: 'POST' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['all-users'] }),
  });

  const removeMentor = useMutation({
    mutationFn: (id: string) => apiFetch(`/users/${id}/mentor`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['all-users'] }),
  });

  const changePassword = useMutation({
    mutationFn: (password: string) =>
      apiFetch('/users/password', { method: 'PUT', body: JSON.stringify({ password }) }),
    onSuccess: () => {
      setPasswordStatus({ success: 'Password updated successfully' });
      setPasswordForm({ newPassword: '', show: false });
    },
    onError: (err: any) => setPasswordStatus({ error: err.message || 'Failed to update password' }),
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);
    if (passwordForm.newPassword.length < 6) {
      setPasswordStatus({ error: 'Password must be at least 6 characters' });
      return;
    }
    changePassword.mutate(passwordForm.newPassword);
  };

  if (!isCoordinator && user) {
    router.push('/dashboard');
    return null;
  }

  const filteredUsers = users?.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      `${u.profile?.firstName || ''} ${u.profile?.lastName || ''}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* Header Banner — consistent with Events Hub / Career Tracking */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-accent-coral via-orange-500 to-orange-400 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Users className="w-8 h-8" />
              User Management
            </h1>
            <p className="text-white/80 text-sm font-light max-w-xl">
              View all registered users, manage mentor roles, and update coordinator credentials.
            </p>
          </div>
          <button
            onClick={() => setPasswordForm((prev) => ({ ...prev, show: !prev.show }))}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all self-start md:self-auto"
          >
            <Key className="w-4 h-4" />
            Change My Password
          </button>
        </div>
      </div>

      {/* Password Change Panel */}
      {passwordForm.show && (
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-semibold text-foreground">Change Account Password</h3>
          <form onSubmit={handlePasswordSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                New Password
              </label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder-text-muted focus:outline-none focus:border-accent-coral transition-colors"
                placeholder="Minimum 6 characters"
              />
            </div>
            <button
              type="submit"
              disabled={changePassword.isPending}
              className="px-6 py-2.5 rounded-xl bg-accent-coral hover:bg-accent-coral/90 text-white font-semibold text-sm disabled:opacity-50 whitespace-nowrap transition-all shadow-lg shadow-accent-coral/20"
            >
              {changePassword.isPending ? 'Updating...' : 'Update Password'}
            </button>
          </form>
          {passwordStatus?.error && (
            <p className="text-rose-500 text-sm">{passwordStatus.error}</p>
          )}
          {passwordStatus?.success && (
            <p className="text-emerald-500 text-sm">{passwordStatus.success}</p>
          )}
        </div>
      )}

      {/* Search + Table Card */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden">

        {/* Search toolbar */}
        <div className="p-4 border-b border-border flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2 text-sm text-foreground placeholder-text-muted focus:outline-none focus:border-accent-coral transition-colors"
            />
          </div>
          <span className="text-xs text-text-muted hidden sm:block">
            {filteredUsers?.length ?? 0} user{filteredUsers?.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-background border-b border-border">
              <tr>
                <th className="px-6 py-3.5 font-semibold text-text-muted uppercase tracking-wider text-xs">User</th>
                <th className="px-6 py-3.5 font-semibold text-text-muted uppercase tracking-wider text-xs">Email</th>
                <th className="px-6 py-3.5 font-semibold text-text-muted uppercase tracking-wider text-xs">Roles</th>
                <th className="px-6 py-3.5 font-semibold text-text-muted uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-accent-coral border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs text-text-muted">Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : !filteredUsers || filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-text-muted text-sm">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-accent-coral/[0.03] transition-colors">

                    {/* Avatar + Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-accent-coral/15 text-accent-coral flex items-center justify-center font-bold text-sm shrink-0">
                          {u.profile?.firstName?.[0]?.toUpperCase() || u.email[0].toUpperCase()}
                        </div>
                        <span className="font-medium text-foreground">
                          {u.profile
                            ? `${u.profile.firstName} ${u.profile.lastName}`
                            : <span className="text-text-muted italic text-xs">No profile</span>}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-text-muted text-sm">{u.email}</td>

                    {/* Role Badges */}
                    <td className="px-6 py-4">
                      <div className="flex gap-2 flex-wrap">
                        {u.roles.map((r: string) => (
                          <span
                            key={r}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                              r === 'MENTOR'
                                ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                : r === 'PLACEMENT_COORDINATOR'
                                ? 'bg-accent-coral/10 text-accent-coral border-accent-coral/20'
                                : 'bg-border text-text-muted border-border'
                            }`}
                          >
                            {r === 'PLACEMENT_COORDINATOR'
                              ? 'Coordinator'
                              : r.charAt(0) + r.slice(1).toLowerCase()}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      {!u.roles.includes('PLACEMENT_COORDINATOR') &&
                        (u.roles.includes('MENTOR') ? (
                          <button
                            onClick={() => removeMentor.mutate(u.id)}
                            disabled={removeMentor.isPending}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 font-semibold text-xs disabled:opacity-50 transition-all"
                          >
                            <ShieldOff className="w-3.5 h-3.5" />
                            Remove Mentor
                          </button>
                        ) : (
                          <button
                            onClick={() => assignMentor.mutate(u.id)}
                            disabled={assignMentor.isPending}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 font-semibold text-xs disabled:opacity-50 transition-all"
                          >
                            <Shield className="w-3.5 h-3.5" />
                            Make Mentor
                          </button>
                        ))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
