'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../../../lib/api';
import Link from 'next/link';
import { ArrowRight, Terminal, BookOpen, ExternalLink, Plus, Edit2, Trash2 } from 'lucide-react';
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

interface CoreSubjectNote {
  id: string;
  subject: string;
  notesLink: string;
}

export default function PlacementDashboard() {
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();

  // Dialog/Modal states
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [subjectInput, setSubjectInput] = useState('');
  const [linkInput, setLinkInput] = useState('');
  const [noteError, setNoteError] = useState('');

  // Fetch DSA Stats
  const { data: dsaStats, isLoading: isDsaLoading } = useQuery<DsaDashboard>({
    queryKey: ['dsa-dashboard-stats'],
    queryFn: () => apiFetch('/dsa/dashboard'),
    enabled: !loading && !!user,
  });

  // Fetch Core Subject Notes
  const { data: subjectNotes, isLoading: isNotesLoading } = useQuery<CoreSubjectNote[]>({
    queryKey: ['core-subject-notes'],
    queryFn: () => apiFetch('/core-subject-notes'),
    enabled: !loading && !!user,
  });

  // Add or Update Mutation
  const saveNoteMutation = useMutation({
    mutationFn: (payload: { subject: string; notesLink: string; id?: string }) => {
      if (payload.id) {
        return apiFetch(`/core-subject-notes/${payload.id}`, {
          method: 'PUT',
          body: JSON.stringify({ subject: payload.subject, notesLink: payload.notesLink })
        });
      } else {
        return apiFetch('/core-subject-notes', {
          method: 'POST',
          body: JSON.stringify({ subject: payload.subject, notesLink: payload.notesLink })
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['core-subject-notes'] });
      setShowNoteModal(false);
      resetNoteForm();
    },
    onError: (err: any) => {
      setNoteError(err.message || 'Failed to save subject note');
    }
  });

  // Delete Mutation
  const deleteNoteMutation = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/core-subject-notes/${id}`, {
        method: 'DELETE'
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['core-subject-notes'] });
    }
  });

  const resetNoteForm = () => {
    setSubjectInput('');
    setLinkInput('');
    setNoteError('');
    setIsEditingNote(false);
    setEditingNoteId(null);
  };

  const handleOpenAdd = () => {
    resetNoteForm();
    setShowNoteModal(true);
  };

  const handleOpenEdit = (note: CoreSubjectNote) => {
    setSubjectInput(note.subject);
    setLinkInput(note.notesLink);
    setIsEditingNote(true);
    setEditingNoteId(note.id);
    setNoteError('');
    setShowNoteModal(true);
  };

  const handleSaveNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectInput.trim() || !linkInput.trim()) {
      setNoteError('Please fill in all fields');
      return;
    }
    saveNoteMutation.mutate({
      subject: subjectInput,
      notesLink: linkInput,
      id: editingNoteId || undefined
    });
  };

  if (isDsaLoading || isNotesLoading) {
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
            Track your DSA coding practice and manage core subject revision materials in one place.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: DSA Practice Tracker */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-500" />
            Coding Practice
          </h2>
          {dsaStats && (
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-violet-500/30 transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400">
                    <Terminal className="w-6 h-6" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-white font-semibold">DSA Practice Tracker</h3>
                    <p className="text-xs text-slate-400 font-light">
                      Organize and keep track of coding problems across platforms like LeetCode and GFG.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 bg-white/5 p-4 rounded-2xl">
                  <div>
                    <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Total</p>
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

              <div className="border-t border-white/10 pt-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Difficulty Breakdown</h4>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" /> Easy: {dsaStats.easySolved}
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <span className="w-2 h-2 rounded-full bg-amber-400" /> Med: {dsaStats.mediumSolved}
                  </div>
                  <div className="flex items-center gap-1.5 text-rose-400">
                    <span className="w-2 h-2 rounded-full bg-rose-400" /> Hard: {dsaStats.hardSolved}
                  </div>
                </div>
              </div>

              <Link
                href="/dashboard/placement/dsa"
                className="w-full py-3 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white rounded-xl text-center text-sm font-semibold transition-all shadow-lg shadow-violet-600/20 flex items-center justify-center gap-2 group"
              >
                Open DSA Tracker
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}

          {dsaStats && dsaStats.totalProblems === 0 && (
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-dashed border-white/10 text-center">
              <Terminal className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No problems added yet. Start practicing today!</p>
            </div>
          )}
        </div>

        {/* Right: Core Subject Notes */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-500" />
              Core Subject Notes
            </h2>
            <button
              onClick={handleOpenAdd}
              className="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Note
            </button>
          </div>

          <div className="space-y-4">
            {!subjectNotes || subjectNotes.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white/[0.02] border-2 border-dashed border-white/10 text-center space-y-3">
                <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white">No subject notes linked yet</p>
                  <p className="text-xs text-slate-400 font-light max-w-xs mx-auto">
                    Save Google Drive links, Notion notes, or study materials for DBMS, Operating Systems, Computer Networks, etc.
                  </p>
                </div>
                <button
                  onClick={handleOpenAdd}
                  className="text-xs font-semibold text-violet-400 hover:text-violet-300 inline-flex items-center gap-1"
                >
                  Link your first subject note <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {subjectNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex items-center justify-between gap-4 group"
                  >
                    <div className="min-w-0 space-y-1">
                      <h3 className="font-bold text-white truncate">{note.subject}</h3>
                      <a
                        href={note.notesLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-400 hover:text-violet-400 transition-colors inline-flex items-center gap-1 max-w-full truncate font-light"
                      >
                        <span className="truncate">{note.notesLink}</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(note)}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteNoteMutation.mutate(note.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 p-6 rounded-3xl max-w-md w-full space-y-4">
            <h3 className="text-xl font-bold text-white">
              {isEditingNote ? 'Edit Subject Note' : 'Add Subject Note'}
            </h3>

            <form onSubmit={handleSaveNoteSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Subject Name</label>
                <input
                  type="text"
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  placeholder="e.g. DBMS, Operating Systems"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500/50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Notes / Study Material Link</label>
                <input
                  type="url"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500/50"
                  required
                />
              </div>

              {noteError && <p className="text-xs text-rose-400">{noteError}</p>}

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="px-4 py-2.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveNoteMutation.isPending}
                  className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-all"
                >
                  {saveNoteMutation.isPending ? 'Saving...' : 'Save Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
