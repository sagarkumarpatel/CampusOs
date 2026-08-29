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
  UserCog,
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent-coral"></div>
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
    ...(user?.roles?.includes('PLACEMENT_COORDINATOR')
      ? [{ name: 'All Users', href: '/dashboard/users', icon: UserCog }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row font-sans transition-colors duration-300">
      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 md:h-screen md:sticky md:top-0 bg-surface border-b md:border-b-0 md:border-r border-border flex flex-col shrink-0 overflow-hidden shadow-2xl shadow-black/5 z-20">
        {/* Logo Header */}
        <div className="p-6 border-b border-border flex items-center justify-between shrink-0">
          <Link href="/dashboard" className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-accent-coral to-orange-400">
            CampusOS
          </Link>
          <span className="md:hidden p-2 rounded-md hover:bg-border/50 cursor-pointer transition-colors">
            <Menu className="w-6 h-6 text-text-muted" />
          </span>
        </div>

        {/* User preview */}
        <div className="p-6 flex items-center gap-3 border-b border-border bg-foreground/5 shrink-0 backdrop-blur-sm">
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-accent-coral to-orange-500 flex items-center justify-center font-bold text-white shadow-lg shrink-0">
            {user?.profile?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <h4 className="text-sm font-semibold truncate text-foreground">
              {user?.profile ? `${user.profile.firstName} ${user.profile.lastName}` : 'Sagar'}
            </h4>
            <span className="text-xs text-text-muted capitalize">{user?.roles?.join(', ').toLowerCase() || 'student'}</span>
          </div>
        </div>

        {/* Navigation list (scrolls independently) */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto min-h-0">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 min-h-[44px] rounded-xl text-sm font-medium transition-all duration-200 group ${
                  active
                    ? 'bg-accent-coral text-white shadow-lg shadow-accent-coral/20 hover:-translate-y-0.5'
                    : 'text-text-muted hover:text-foreground hover:bg-foreground/5 hover:translate-x-1'
                }`}
              >
                <Icon className={`w-4 h-4 transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions Pin */}
        <div className="p-4 border-t border-border space-y-1.5 shrink-0 mt-auto bg-surface/80 backdrop-blur-md">
          <Link
            href="/dashboard/profile"
            className={`flex items-center gap-3 px-4 min-h-[44px] rounded-xl text-sm font-medium transition-all duration-200 group ${
              pathname === '/dashboard/profile'
                ? 'bg-accent-coral text-white shadow-lg shadow-accent-coral/20'
                : 'text-text-muted hover:text-foreground hover:bg-foreground/5 hover:translate-x-1'
            }`}
          >
            <User className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
            Profile Setup
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 min-h-[44px] rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-all text-left cursor-pointer group hover:translate-x-1"
          >
            <LogOut className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main page content area */}
      <main className="flex-1 flex flex-col min-h-0 bg-background relative overflow-y-auto">
        <div className="max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
