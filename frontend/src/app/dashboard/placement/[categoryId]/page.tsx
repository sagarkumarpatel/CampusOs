'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../../../../lib/api';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, ExternalLink, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface Topic {
  id: string;
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  resourceUrl: string | null;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  notes: string | null;
}

export default function CategoryTopicsPage() {
  const params = useParams();
  const categoryId = params.categoryId as string;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: topics, isLoading, error } = useQuery<Topic[]>({
    queryKey: ['placement-topics', categoryId],
    queryFn: () => apiFetch(`/placement/categories/${categoryId}/topics`),
  });

  const mutation = useMutation({
    mutationFn: ({ topicId, status, notes }: { topicId: string; status: string; notes?: string }) =>
      apiFetch(`/placement/progress/${topicId}`, {
        method: 'PUT',
        body: JSON.stringify({ status, notes }),
      }),
    onSuccess: () => {
      // Invalidate queries to refresh numbers
      queryClient.invalidateQueries({ queryKey: ['placement-topics', categoryId] });
      queryClient.invalidateQueries({ queryKey: ['placement-categories'] });
      queryClient.invalidateQueries({ queryKey: ['placement-overall'] });
    },
  });

  const handleStatusChange = (topicId: string, status: string, currentNotes: string | null) => {
    mutation.mutate({ topicId, status, notes: currentNotes || undefined });
  };

  const handleNotesChange = (topicId: string, currentStatus: string, notes: string) => {
    mutation.mutate({ topicId, status: currentStatus, notes });
  };

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
        Failed to load topics. Please try again.
      </div>
    );
  }

  const difficultyColors = {
    EASY: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    MEDIUM: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    HARD: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  const statusColors = {
    NOT_STARTED: 'bg-slate-800 text-slate-400',
    IN_PROGRESS: 'bg-blue-600/20 text-blue-400 border-blue-500/30',
    COMPLETED: 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20',
  };

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto overflow-y-auto">
      {/* Back navigation */}
      <div>
        <Link href="/dashboard/placement" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to categories
        </Link>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Syllabus Topics</h1>
          <p className="text-slate-400 text-sm mt-1">Mark topics to track overall category progress.</p>
        </div>
      </div>

      <div className="space-y-4">
        {topics?.length === 0 ? (
          <p className="text-slate-500 text-sm">No topics have been seeded for this category yet.</p>
        ) : (
          topics?.map((topic) => (
            <div
              key={topic.id}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/10 transition-colors"
            >
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${difficultyColors[topic.difficulty]}`}>
                    {topic.difficulty}
                  </span>
                  <h3 className="text-lg font-bold text-white">{topic.title}</h3>
                </div>

                <div className="flex items-center gap-6 text-xs text-slate-400">
                  {topic.resourceUrl && (
                    <a
                      href={topic.resourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 hover:text-indigo-300 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      View Learning Resource
                    </a>
                  )}
                </div>

                {/* Optional Notes field */}
                <div className="pt-2">
                  <input
                    type="text"
                    defaultValue={topic.notes || ''}
                    placeholder="Add custom notes or solve link..."
                    onBlur={(e) => handleNotesChange(topic.id, topic.status, e.target.value)}
                    className="w-full max-w-md px-3 py-1.5 rounded-lg bg-black/20 border border-white/5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
              </div>

              {/* Triple state selector */}
              <div className="flex items-center gap-2 shrink-0">
                {(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(topic.id, status, topic.notes)}
                    disabled={mutation.isPending && mutation.variables?.topicId === topic.id}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 border border-transparent ${
                      topic.status === status
                        ? statusColors[status]
                        : 'bg-white/5 hover:bg-white/10 text-slate-400'
                    }`}
                  >
                    {mutation.isPending && mutation.variables?.topicId === topic.id && mutation.variables?.status === status ? (
                      <RefreshCw className="w-3 h-3 animate-spin inline mr-1" />
                    ) : null}
                    {status.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
