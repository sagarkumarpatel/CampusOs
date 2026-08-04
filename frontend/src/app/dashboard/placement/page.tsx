'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../../../lib/api';
import Link from 'next/link';
import { BookOpen, CheckCircle, ArrowRight } from 'lucide-react';

interface CategoryOverview {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  totalTopics: number;
  completedTopics: number;
  progressPercent: number;
}

export default function PlacementDashboard() {
  const { data: categories, isLoading, error } = useQuery<CategoryOverview[]>({
    queryKey: ['placement-categories'],
    queryFn: () => apiFetch('/placement/categories'),
  });

  const { data: overallProgress } = useQuery<{
    totalTopics: number;
    completedTopics: number;
    progressPercent: number;
  }>({
    queryKey: ['placement-overall'],
    queryFn: () => apiFetch('/placement/progress'),
  });

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-rose-400">
        Failed to load categories. Please try again.
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto">
      {/* Header Banner with Overall Progress */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 border border-indigo-500/20 relative overflow-hidden shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Placement Preparation</h1>
          <p className="text-slate-300 text-sm max-w-xl font-light">
            Track and master technical interview topics across Data Structures, Algorithms, Core Computer Science, and System Design.
          </p>
        </div>

        {overallProgress && (
          <div className="relative z-10 bg-white/5 border border-white/10 p-6 rounded-2xl min-w-[240px] flex items-center gap-4">
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center font-bold text-lg text-indigo-300">
              {/* Simple inline progress circle */}
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="currentColor" className="text-white/10" strokeWidth="4" fill="transparent" />
                <circle cx="32" cy="32" r="28" stroke="currentColor" className="text-indigo-500" strokeWidth="4" fill="transparent"
                  strokeDasharray={175}
                  strokeDashoffset={175 - (175 * overallProgress.progressPercent) / 100}
                />
              </svg>
              <span>{overallProgress.progressPercent}%</span>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Overall Progress</h4>
              <p className="text-sm font-bold text-white mt-1">
                {overallProgress.completedTopics} / {overallProgress.totalTopics} Completed
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories?.map((cat) => (
          <Link
            key={cat.id}
            href={`/dashboard/placement/${cat.id}`}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 hover:bg-white/10 transition-all group flex flex-col justify-between h-56"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold shadow-inner"
                  style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                >
                  {cat.icon || '📦'}
                </span>
                <span className="text-slate-400 group-hover:text-white flex items-center gap-1 text-xs font-medium transition-colors">
                  Open Topics <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{cat.name}</h3>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-light">{cat.description}</p>
            </div>

            <div className="border-t border-white/5 pt-4 mt-4">
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-2">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />
                  {cat.completedTopics} of {cat.totalTopics} completed
                </span>
                <span>{cat.progressPercent}%</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${cat.progressPercent}%`, backgroundColor: cat.color || '#6366f1' }}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
