'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../providers/AuthProvider';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Calendar,
  Layers,
  FileText,
  Briefcase,
  User,
  LogOut,
  Menu,
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div>
      </div>
    );
  }

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Placement Prep', href: '/dashboard/placement', icon: BookOpen },
    { name: 'Mentorship', href: '/dashboard/mentorship', icon: Users },
    { name: 'Events Hub', href: '/dashboard/events', icon: Calendar },
    { name: 'Resources', href: '/dashboard/resources', icon: FileText },
    { name: 'Career Tracking', href: '/dashboard/career', icon: Briefcase },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row">
      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 md:h-screen md:sticky md:top-0 bg-slate-900 border-b md:border-b-0 md:border-r border-white/5 flex flex-col shrink-0 overflow-hidden">
        {/* Logo Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
          <Link href="/dashboard" className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-violet-300">
            CampusOS
          </Link>
          <span className="md:hidden">
            <Menu className="w-6 h-6 text-slate-400 cursor-pointer" />
          </span>
        </div>

        {/* User preview */}
        <div className="p-6 flex items-center gap-3 border-b border-white/5 bg-white/5 shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-white shadow-md shrink-0">
            {user?.profile?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <h4 className="text-sm font-semibold truncate">
              {user?.profile ? `${user.profile.firstName} ${user.profile.lastName}` : 'Sagar'}
            </h4>
            <span className="text-xs text-slate-400 capitalize">{user?.role?.toLowerCase() || 'student'}</span>
          </div>
        </div>

        {/* Navigation list (scrolls independently) */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto min-h-0">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions Pin */}
        <div className="p-4 border-t border-white/5 space-y-1 shrink-0 mt-auto bg-slate-900/80 backdrop-blur-md">
          <Link
            href="/dashboard/profile"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              pathname === '/dashboard/profile'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <User className="w-4 h-4" />
            Profile Setup
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all text-left cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main page content area */}
      <main className="flex-1 flex flex-col min-h-0 bg-slate-950">
        {children}
      </main>
    </div>
  );
}
