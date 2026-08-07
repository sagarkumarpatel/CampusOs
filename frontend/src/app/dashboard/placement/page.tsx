'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../../../lib/api';
import Link from 'next/link';
import { ArrowRight, Terminal } from 'lucide-react';
import { useAuth } from '../../../providers/AuthProvider';

interface DsaDashboard {
  totalProblems: number;
  solvedProblems: number;
  remainingProblems: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  progressPercent: number;
}

export default function PlacementDashboard() {
  const { user, loading } = useAuth();

  const { data: dsaStats, isLoading } = useQuery<DsaDashboard>({
    queryKey: ['dsa-dashboard-stats'],
    queryFn: () => apiFetch('/dsa/dashboard'),
    enabled: !loading && !!user,
  });

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-violet-900 via-violet-950 to-slate-950 border border-violet-500/20 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Placement Preparation</h1>
          <p className="text-slate-300 text-sm max-w-xl font-light">
            Track your DSA coding practice across topics like Arrays, Trees, Graphs, Dynamic Programming, and more.
          </p>
        </div>
      </div>

      {/* DSA Practice Tracker Card */}
      {dsaStats && (
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-violet-500/30 transition-all flex flex-col lg:flex-row gap-6 justify-between items-stretch">
          <div className="flex-1 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400">
                  <Terminal className="w-6 h-6" />
                </span>
                <div>
                  <h3 className="text-xl font-bold text-white">DSA Practice Tracker</h3>
                  <p className="text-xs text-slate-400 font-light">
                    Organize and keep track of coding problems across platforms like LeetCode and GFG.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 bg-white/5 p-4 rounded-2xl">
              <div>
                <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Total Problems</p>
                <p className="text-2xl font-bold text-white mt-1">{dsaStats.totalProblems}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Solved</p>
                <p className="text-2xl font-bold text-violet-400 mt-1">{dsaStats.solvedProblems}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Remaining</p>
                <p className="text-2xl font-bold text-slate-400 mt-1">{dsaStats.remainingProblems}</p>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>Practice Progress</span>
                <span>{dsaStats.progressPercent}%</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
                  style={{ width: dsaStats.progressPercent + '%' }}
                />
              </div>
            </div>
          </div>

          <div className="border-t lg:border-t-0 lg:border-l border-white/10 lg:pl-6 pt-6 lg:pt-0 flex flex-col justify-between min-w-[240px]">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Difficulty Breakdown</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" /> Easy Solved
                  </span>
                  <span className="font-bold text-white">{dsaStats.easySolved}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <span className="w-2 h-2 rounded-full bg-amber-400" /> Medium Solved
                  </span>
                  <span className="font-bold text-white">{dsaStats.mediumSolved}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-rose-400">
                    <span className="w-2 h-2 rounded-full bg-rose-400" /> Hard Solved
                  </span>
                  <span className="font-bold text-white">{dsaStats.hardSolved}</span>
                </div>
              </div>
            </div>

            <Link
              href="/dashboard/placement/dsa"
              className="mt-6 w-full py-3 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white rounded-xl text-center text-sm font-semibold transition-all shadow-lg shadow-violet-600/20 flex items-center justify-center gap-2 group"
            >
              Open DSA Tracker
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      )}

      {/* Empty state when no problems added yet */}
      {dsaStats && dsaStats.totalProblems === 0 && (
        <div className="p-12 rounded-3xl bg-white/[0.02] border-2 border-dashed border-white/10 text-center">
          <Terminal className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No problems added yet.</p>
          <Link
            href="/dashboard/placement/dsa"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300"
          >
            Go to DSA Tracker to add your first problem <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
