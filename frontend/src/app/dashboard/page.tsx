'use client';

import React from 'react';
import { useAuth } from '../../providers/AuthProvider';
import Link from 'next/link';
import {
  CheckCircle2,
  Calendar,
  Users,
  Layers,
  FileText,
  Briefcase,
  ArrowUpRight,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto">
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-900 to-violet-950 border border-indigo-500/20 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.profile?.firstName || 'Sagar'}!
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl font-light">
            You are making great progress in your growth journey. Track preparation goals, find matching mentors, and log internship applications.
          </p>
        </div>
      </div>

      {/* Modules Dashboard Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Module 1: Placement Preparation Progress */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 hover:bg-white/10 transition-all group flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-5 h-5" />
              </span>
              <Link href="/dashboard/placement" className="text-slate-400 hover:text-white flex items-center gap-1 text-xs">
                View Prep <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <h3 className="font-semibold text-lg mb-1">Placement Preparation</h3>
            <p className="text-xs text-slate-400 mb-6">Track your DSA and Computer Science syllabus</p>
          </div>
          <div>
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-indigo-300">Overall Progress</span>
              <span>70%</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: '70%' }} />
            </div>
          </div>
        </div>

        {/* Module 2: Mentor Guidance Summary */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 hover:bg-white/10 transition-all group flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </span>
              <Link href="/dashboard/mentorship" className="text-slate-400 hover:text-white flex items-center gap-1 text-xs">
                Find Mentor <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <h3 className="font-semibold text-lg mb-1">My Mentor</h3>
            <p className="text-xs text-slate-400 mb-4">Connecting with senior guidance</p>
            
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm text-white">
                R
              </div>
              <div>
                <h4 className="text-xs font-semibold">Rohit Sharma</h4>
                <p className="text-[10px] text-slate-400">Software Engineer @ Google</p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center text-xs">
            <span className="text-[10px] text-indigo-400 font-medium px-2 py-0.5 rounded bg-indigo-500/15">Active Session</span>
            <span className="text-slate-400">Next Sync: Tomorrow</span>
          </div>
        </div>

        {/* Module 3: Events hub */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 hover:bg-white/10 transition-all group flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5" />
              </span>
              <Link href="/dashboard/events" className="text-slate-400 hover:text-white flex items-center gap-1 text-xs">
                All Events <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <h3 className="font-semibold text-lg mb-1">Upcoming Events</h3>
            <p className="text-xs text-slate-400 mb-4">Hackathons, contests & seminars</p>
            
            <div className="space-y-2">
              <div className="p-2 rounded-lg bg-white/5 border border-white/5 flex justify-between items-center">
                <span className="text-xs font-medium truncate">Annual WebDev Hackathon</span>
                <span className="text-[10px] text-slate-400 shrink-0 ml-2">Aug 12</span>
              </div>
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-400">
            Registered: <span className="text-indigo-400 font-semibold">1 event</span>
          </div>
        </div>

        {/* Module 4: Joined Clubs */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 hover:bg-white/10 transition-all group flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </span>
              <Link href="/dashboard/clubs" className="text-slate-400 hover:text-white flex items-center gap-1 text-xs">
                Explore Clubs <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <h3 className="font-semibold text-lg mb-1">Joined Clubs</h3>
            <p className="text-xs text-slate-400 mb-4">Campus communities you support</p>
            
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] font-semibold px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-full">Coding Club</span>
              <span className="text-[10px] font-semibold px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-full">AI/ML Club</span>
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-400">
            Active memberships: <span className="text-white font-semibold">2</span>
          </div>
        </div>

        {/* Module 5: Saved Notes */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 hover:bg-white/10 transition-all group flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </span>
              <Link href="/dashboard/resources" className="text-slate-400 hover:text-white flex items-center gap-1 text-xs">
                Resources <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <h3 className="font-semibold text-lg mb-1">Academic Resources</h3>
            <p className="text-xs text-slate-400 mb-4">Saved lecture notes & roadmaps</p>
            
            <div className="space-y-2">
              <div className="p-2 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-xs truncate">DBMS Normalization Cheat Sheet</span>
              </div>
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-400">
            Bookmarked items: <span className="text-white font-semibold">1</span>
          </div>
        </div>

        {/* Module 6: Career Applications */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 hover:bg-white/10 transition-all group flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 group-hover:scale-110 transition-transform">
                <Briefcase className="w-5 h-5" />
              </span>
              <Link href="/dashboard/career" className="text-slate-400 hover:text-white flex items-center gap-1 text-xs">
                Applications <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <h3 className="font-semibold text-lg mb-1">Career Tracking</h3>
            <p className="text-xs text-slate-400 mb-4">Application pipeline timeline</p>
            
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Google</span>
                <span className="text-indigo-400">Technical Interview</span>
              </div>
              <p className="text-[10px] text-slate-400">Software Engineer Intern</p>
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-400">
            Total active logs: <span className="text-white font-semibold">1</span>
          </div>
        </div>

      </div>
    </div>
  );
}
