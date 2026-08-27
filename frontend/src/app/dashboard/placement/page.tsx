'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../../../lib/api';
import Link from 'next/link';
import { ArrowRight, Terminal, BookOpen, ExternalLink, Plus, Edit2, Trash2, FileText } from 'lucide-react';
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

interface PersonalResume {
  id: string;
  resumeLink: string;
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

  // Personal Resume state
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [isEditingResume, setIsEditingResume] = useState(false);
  const [resumeLinkInput, setResumeLinkInput] = useState('');
  const [resumeError, setResumeError] = useState('');
  const [showDeleteResumeConfirm, setShowDeleteResumeConfirm] = useState(false);

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

  // Personal Resume — fetch
  const { data: personalResume, isLoading: isResumeLoading } = useQuery<PersonalResume | null>({
    queryKey: ['personal-resume'],
    queryFn: () => apiFetch('/personal-resume'),
    enabled: !loading && !!user,
  });

  // Personal Resume — save (create or update)
  const saveResumeMutation = useMutation({
    mutationFn: (payload: { resumeLink: string; id?: string }) => {
      if (payload.id) {
        return apiFetch(`/personal-resume/${payload.id}`, {
          method: 'PUT',
          body: JSON.stringify({ resumeLink: payload.resumeLink }),
        });
      }
      return apiFetch('/personal-resume', {
        method: 'POST',
        body: JSON.stringify({ resumeLink: payload.resumeLink }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personal-resume'] });
      setShowResumeModal(false);
      setResumeLinkInput('');
      setResumeError('');
    },
    onError: (err: any) => {
      setResumeError(err.message || 'Failed to save resume link');
    },
  });

  // Personal Resume — delete
  const deleteResumeMutation = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/personal-resume/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personal-resume'] });
      setShowDeleteResumeConfirm(false);
    },
  });

  const handleOpenAddResume = () => {
    setIsEditingResume(false);
    setResumeLinkInput('');
    setResumeError('');
    setShowResumeModal(true);
  };

  const handleOpenEditResume = (link: string) => {
    setIsEditingResume(true);
    setResumeLinkInput(link);
    setResumeError('');
    setShowResumeModal(true);
  };

  const handleSaveResumeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeLinkInput.trim()) {
      setResumeError('Please enter a resume link');
      return;
    }
    saveResumeMutation.mutate({
      resumeLink: resumeLinkInput,
      id: isEditingResume && personalResume ? personalResume.id : undefined,
    });
  };

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

  if (isDsaLoading || isNotesLoading || isResumeLoading) {
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
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Placement Preparation</h1>
          <p className="text-foreground text-sm max-w-xl font-light">
            Track your DSA practice, organise subject notes, and keep your resume accessible — all in one place.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: DSA Practice Tracker */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-500" />
            Coding Practice
          </h2>
          {dsaStats && (
            <div className="p-6 rounded-3xl bg-surface border border-border hover:border-violet-500/30 transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400">
                    <Terminal className="w-6 h-6" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-foreground font-semibold">DSA Practice Tracker</h3>
                    <p className="text-xs text-text-muted font-light">
                      Organize and keep track of coding problems across platforms like LeetCode and GFG.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 bg-surface p-4 rounded-2xl">
                  <div>
                    <p className="text-[10px] uppercase font-semibold text-text-muted tracking-wider">Total</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{dsaStats.totalProblems}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-semibold text-text-muted tracking-wider">Solved</p>
                    <p className="text-2xl font-bold text-violet-400 mt-1">{dsaStats.solvedProblems}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-semibold text-text-muted tracking-wider">Remaining</p>
                    <p className="text-2xl font-bold text-text-muted mt-1">{dsaStats.remainingProblems}</p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-foreground font-semibold mb-1">
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

              <div className="border-t border-border pt-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">Difficulty Breakdown</h4>
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
                className="w-full py-3 bg-accent-coral hover:bg-accent-coral active:bg-orange-600 text-foreground rounded-xl text-center text-sm font-semibold transition-all shadow-lg shadow-accent-coral/20 flex items-center justify-center gap-2 group"
              >
                Open DSA Tracker
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}

          {dsaStats && dsaStats.totalProblems === 0 && (
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-dashed border-border text-center">
              <Terminal className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-text-muted">No problems added yet. Start practicing today!</p>
            </div>
          )}
        </div>

        {/* Right: Core Subject Notes */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-500" />
              Core Subject Notes
            </h2>
            <button
              onClick={handleOpenAdd}
              className="px-3.5 py-1.5 bg-accent-coral hover:bg-accent-coral active:bg-orange-600 text-foreground rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Note
            </button>
          </div>

          <div className="space-y-4">
            {!subjectNotes || subjectNotes.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white/[0.02] border-2 border-dashed border-border text-center space-y-3">
                <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">No subject notes linked yet</p>
                  <p className="text-xs text-text-muted font-light max-w-xs mx-auto">
                    Save Google Drive links, Notion notes, or study materials for DBMS, Operating Systems, Computer Networks, etc.
                  </p>
                </div>
                <button
                  onClick={handleOpenAdd}
                  className="text-xs font-semibold text-violet-400 hover:text-orange-400 inline-flex items-center gap-1"
                >
                  Link your first subject note <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {subjectNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-border transition-all flex items-center justify-between gap-4 group"
                  >
                    <div className="min-w-0 space-y-1">
                      <h3 className="font-bold text-foreground truncate">{note.subject}</h3>
                      <a
                        href={note.notesLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-text-muted hover:text-violet-400 transition-colors inline-flex items-center gap-1 max-w-full truncate font-light"
                      >
                        <span className="truncate">{note.notesLink}</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(note)}
                        className="p-1.5 text-text-muted hover:text-foreground rounded-lg hover:bg-surface transition-all cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteNoteMutation.mutate(note.id)}
                        className="p-1.5 text-text-muted hover:text-rose-400 rounded-lg hover:bg-surface transition-all cursor-pointer"
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

        {/* Third column: Personal Resume */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-500" />
              Personal Resume
            </h2>
            {!personalResume && (
              <button
                onClick={handleOpenAddResume}
                className="px-3.5 py-1.5 bg-accent-coral hover:bg-accent-coral active:bg-orange-600 text-foreground rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add Resume
              </button>
            )}
          </div>

          {!personalResume ? (
            <div className="p-12 rounded-3xl bg-white/[0.02] border-2 border-dashed border-border text-center space-y-3">
              <FileText className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">No resume added yet</p>
                <p className="text-xs text-text-muted font-light max-w-xs mx-auto">
                  Save your Google Drive, OneDrive, or Notion resume link for quick access during placements.
                </p>
              </div>
              <button
                onClick={handleOpenAddResume}
                className="text-xs font-semibold text-violet-400 hover:text-orange-400 inline-flex items-center gap-1"
              >
                Add your resume link <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-border transition-all space-y-5">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400 flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </span>
                <div className="min-w-0">
                  <p className="font-bold text-foreground text-sm">My Resume</p>
                  <a
                    href={personalResume.resumeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-text-muted hover:text-violet-400 transition-colors inline-flex items-center gap-1 truncate max-w-full font-light"
                  >
                    <span className="truncate">{personalResume.resumeLink}</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>
              </div>

              <a
                href={personalResume.resumeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-accent-coral hover:bg-accent-coral active:bg-orange-600 text-foreground rounded-xl text-center text-sm font-semibold transition-all shadow-lg shadow-accent-coral/20 flex items-center justify-center gap-2 group"
              >
                <ExternalLink className="w-4 h-4" />
                Open Resume
              </a>

              <div className="flex gap-3">
                <button
                  onClick={() => handleOpenEditResume(personalResume.resumeLink)}
                  className="flex-1 py-2 text-xs font-semibold text-foreground hover:text-foreground border border-border hover:border-border rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => setShowDeleteResumeConfirm(true)}
                  className="flex-1 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 border border-rose-500/20 hover:border-rose-500/40 rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background border border-border p-6 rounded-3xl max-w-md w-full space-y-4">
            <h3 className="text-xl font-bold text-foreground">
              {isEditingNote ? 'Edit Subject Note' : 'Add Subject Note'}
            </h3>

            <form onSubmit={handleSaveNoteSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-muted">Subject Name</label>
                <input
                  type="text"
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  placeholder="e.g. DBMS, Operating Systems"
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-accent-coral/50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-muted">Notes / Study Material Link</label>
                <input
                  type="url"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-accent-coral/50"
                  required
                />
              </div>

              {noteError && <p className="text-xs text-rose-400">{noteError}</p>}

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="px-4 py-2.5 text-xs text-text-muted hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveNoteMutation.isPending}
                  className="px-5 py-2.5 bg-accent-coral hover:bg-accent-coral disabled:opacity-50 text-foreground rounded-xl text-xs font-semibold transition-all"
                >
                  {saveNoteMutation.isPending ? 'Saving...' : 'Save Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Personal Resume — Add / Edit Modal */}
      {showResumeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background border border-border p-6 rounded-3xl max-w-md w-full space-y-4">
            <h3 className="text-xl font-bold text-foreground">
              {isEditingResume ? 'Edit Resume Link' : 'Add Resume Link'}
            </h3>
            <form onSubmit={handleSaveResumeSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-muted">Resume Link</label>
                <input
                  type="url"
                  value={resumeLinkInput}
                  onChange={(e) => setResumeLinkInput(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-accent-coral/50"
                  required
                  autoFocus
                />
                <p className="text-[10px] text-text-muted">
                  Paste your Google Drive, OneDrive, Notion, or any external resume URL.
                </p>
              </div>
              {resumeError && <p className="text-xs text-rose-400">{resumeError}</p>}
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowResumeModal(false)}
                  className="px-4 py-2.5 text-xs text-text-muted hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveResumeMutation.isPending}
                  className="px-5 py-2.5 bg-accent-coral hover:bg-accent-coral disabled:opacity-50 text-foreground rounded-xl text-xs font-semibold transition-all"
                >
                  {saveResumeMutation.isPending ? 'Saving...' : isEditingResume ? 'Save Changes' : 'Save Resume'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Personal Resume — Delete Confirmation */}
      {showDeleteResumeConfirm && personalResume && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background border border-border p-6 rounded-3xl max-w-sm w-full space-y-4">
            <h3 className="text-xl font-bold text-foreground">Delete Resume?</h3>
            <p className="text-sm text-text-muted font-light">
              Are you sure you want to remove your saved resume link from CampusOS?{' '}
              <span className="text-foreground font-medium">Your actual resume on Google Drive or any other service will not be affected.</span>
            </p>
            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteResumeConfirm(false)}
                className="px-4 py-2.5 text-xs text-text-muted hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteResumeMutation.mutate(personalResume.id)}
                disabled={deleteResumeMutation.isPending}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-foreground rounded-xl text-xs font-semibold transition-all"
              >
                {deleteResumeMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
