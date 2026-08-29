'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../../../lib/api';
import { useAuth } from '../../../providers/AuthProvider';
import {
  FileText,
  BookOpen,
  HelpCircle,
  Layers,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Upload,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface SubjectNote {
  id: string;
  subjectName: string;
  resourceLink: string;
  createdAt: string;
}

interface PrevYearQuestion {
  id: string;
  subjectName: string;
  year: number;
  semester: number;
  questionPaperLink: string;
  createdAt: string;
}

interface InterviewNote {
  id: string;
  topicName: string;
  interviewNotesLink: string;
  createdAt: string;
}

interface CheatSheet {
  id: string;
  name: string;
  imageUrl: string;
  createdAt: string;
}

interface ResourcesData {
  subjectNotes: SubjectNote[];
  previousYearQuestions: PrevYearQuestion[];
  interviewNotes: InterviewNote[];
  cheatSheets: CheatSheet[];
}

export default function ResourcesPage() {
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();
  const isPlacementCoordinator = user?.roles?.includes('PLACEMENT_COORDINATOR');

  // Modal & Form States
  const [modalType, setModalType] = useState<'subject-note' | 'prev-question' | 'interview-note' | 'cheat-sheet' | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; type: 'subject-note' | 'prev-question' | 'interview-note' | 'cheat-sheet' } | null>(null);

  // Form Fields
  const [subjectNoteForm, setSubjectNoteForm] = useState({ subjectName: '', resourceLink: '' });
  const [prevQuestionForm, setPrevQuestionForm] = useState({ subjectName: '', year: new Date().getFullYear(), semester: 1, questionPaperLink: '' });
  const [interviewNoteForm, setInterviewNoteForm] = useState({ topicName: '', interviewNotesLink: '' });
  const [cheatSheetForm, setCheatSheetForm] = useState({ name: '', imageUrl: '' });

  const [isUploading, setIsUploading] = useState(false);
  const [formError, setFormError] = useState('');

  // Fetch all resources query
  const { data: resources = { subjectNotes: [], previousYearQuestions: [], interviewNotes: [], cheatSheets: [] }, isLoading } = useQuery<ResourcesData>({
    queryKey: ['resources'],
    queryFn: () => apiFetch('/resources'),
    enabled: !loading && !!user,
  });

  // MUTATIONS

  // Subject Note mutations
  const createSubjectNoteMutation = useMutation({
    mutationFn: (data: typeof subjectNoteForm) => apiFetch('/resources/subject-notes', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      closeModal();
    },
    onError: (error: any) => setFormError(error.message || 'Failed to save subject note'),
  });

  const updateSubjectNoteMutation = useMutation({
    mutationFn: (data: { id: string; payload: Partial<typeof subjectNoteForm> }) =>
      apiFetch(`/resources/subject-notes/${data.id}`, { method: 'PUT', body: JSON.stringify(data.payload) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      closeModal();
    },
    onError: (error: any) => setFormError(error.message || 'Failed to update subject note'),
  });

  const deleteSubjectNoteMutation = useMutation({
    mutationFn: (id: string) => apiFetch(`/resources/subject-notes/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      setDeleteConfirm(null);
    },
  });

  // Previous Year Question mutations
  const createPrevQuestionMutation = useMutation({
    mutationFn: (data: typeof prevQuestionForm) => apiFetch('/resources/previous-year-questions', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      closeModal();
    },
    onError: (error: any) => setFormError(error.message || 'Failed to save question paper'),
  });

  const updatePrevQuestionMutation = useMutation({
    mutationFn: (data: { id: string; payload: Partial<typeof prevQuestionForm> }) =>
      apiFetch(`/resources/previous-year-questions/${data.id}`, { method: 'PUT', body: JSON.stringify(data.payload) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      closeModal();
    },
    onError: (error: any) => setFormError(error.message || 'Failed to update question paper'),
  });

  const deletePrevQuestionMutation = useMutation({
    mutationFn: (id: string) => apiFetch(`/resources/previous-year-questions/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      setDeleteConfirm(null);
    },
  });

  // Interview Note mutations
  const createInterviewNoteMutation = useMutation({
    mutationFn: (data: typeof interviewNoteForm) => apiFetch('/resources/interview-notes', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      closeModal();
    },
    onError: (error: any) => setFormError(error.message || 'Failed to save interview note'),
  });

  const updateInterviewNoteMutation = useMutation({
    mutationFn: (data: { id: string; payload: Partial<typeof interviewNoteForm> }) =>
      apiFetch(`/resources/interview-notes/${data.id}`, { method: 'PUT', body: JSON.stringify(data.payload) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      closeModal();
    },
    onError: (error: any) => setFormError(error.message || 'Failed to update interview note'),
  });

  const deleteInterviewNoteMutation = useMutation({
    mutationFn: (id: string) => apiFetch(`/resources/interview-notes/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      setDeleteConfirm(null);
    },
  });

  // Cheat Sheet mutations
  const createCheatSheetMutation = useMutation({
    mutationFn: (data: typeof cheatSheetForm) => apiFetch('/resources/cheat-sheets', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      closeModal();
    },
    onError: (error: any) => setFormError(error.message || 'Failed to save cheat sheet'),
  });

  const updateCheatSheetMutation = useMutation({
    mutationFn: (data: { id: string; payload: Partial<typeof cheatSheetForm> }) =>
      apiFetch(`/resources/cheat-sheets/${data.id}`, { method: 'PUT', body: JSON.stringify(data.payload) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      closeModal();
    },
    onError: (error: any) => setFormError(error.message || 'Failed to update cheat sheet'),
  });

  const deleteCheatSheetMutation = useMutation({
    mutationFn: (id: string) => apiFetch(`/resources/cheat-sheets/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      setDeleteConfirm(null);
    },
  });

  // Image Upload helper
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setFormError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const data = await apiFetch('/resources/cheat-sheets/upload', {
        method: 'POST',
        body: formData,
      });

      setCheatSheetForm((prev) => ({ ...prev, imageUrl: data.imageUrl }));
    } catch (err: any) {
      setFormError(err.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  // Close modals helper
  const closeModal = () => {
    setModalType(null);
    setEditMode(false);
    setEditId(null);
    setFormError('');
    setSubjectNoteForm({ subjectName: '', resourceLink: '' });
    setPrevQuestionForm({ subjectName: '', year: new Date().getFullYear(), semester: 1, questionPaperLink: '' });
    setInterviewNoteForm({ topicName: '', interviewNotesLink: '' });
    setCheatSheetForm({ name: '', imageUrl: '' });
  };

  // Open modal for editing
  const openEdit = (type: 'subject-note' | 'prev-question' | 'interview-note' | 'cheat-sheet', item: any) => {
    setEditMode(true);
    setEditId(item.id);
    setModalType(type);

    if (type === 'subject-note') {
      setSubjectNoteForm({ subjectName: item.subjectName, resourceLink: item.resourceLink });
    } else if (type === 'prev-question') {
      setPrevQuestionForm({
        subjectName: item.subjectName,
        year: item.year,
        semester: item.semester,
        questionPaperLink: item.questionPaperLink,
      });
    } else if (type === 'interview-note') {
      setInterviewNoteForm({ topicName: item.topicName, interviewNotesLink: item.interviewNotesLink });
    } else if (type === 'cheat-sheet') {
      setCheatSheetForm({ name: item.name, imageUrl: item.imageUrl });
    }
  };

  // Submit forms handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (modalType === 'subject-note') {
      if (editMode && editId) {
        updateSubjectNoteMutation.mutate({ id: editId, payload: subjectNoteForm });
      } else {
        createSubjectNoteMutation.mutate(subjectNoteForm);
      }
    } else if (modalType === 'prev-question') {
      if (editMode && editId) {
        updatePrevQuestionMutation.mutate({ id: editId, payload: prevQuestionForm });
      } else {
        createPrevQuestionMutation.mutate(prevQuestionForm);
      }
    } else if (modalType === 'interview-note') {
      if (editMode && editId) {
        updateInterviewNoteMutation.mutate({ id: editId, payload: interviewNoteForm });
      } else {
        createInterviewNoteMutation.mutate(interviewNoteForm);
      }
    } else if (modalType === 'cheat-sheet') {
      if (!cheatSheetForm.imageUrl) {
        setFormError('Please upload an image first');
        return;
      }
      if (editMode && editId) {
        updateCheatSheetMutation.mutate({ id: editId, payload: cheatSheetForm });
      } else {
        createCheatSheetMutation.mutate(cheatSheetForm);
      }
    }
  };

  // Perform delete operation
  const handleConfirmDelete = () => {
    if (!deleteConfirm) return;
    const { id, type } = deleteConfirm;

    if (type === 'subject-note') {
      deleteSubjectNoteMutation.mutate(id);
    } else if (type === 'prev-question') {
      deletePrevQuestionMutation.mutate(id);
    } else if (type === 'interview-note') {
      deleteInterviewNoteMutation.mutate(id);
    } else if (type === 'cheat-sheet') {
      deleteCheatSheetMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-accent-coral" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full space-y-12">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-orange-500 to-orange-400">
            Resources Library
          </h1>
          <p className="text-text-muted mt-1 text-sm">
            Access curated academic study materials, previous question papers, and placement resources.
          </p>
        </div>
      </div>

      {/* SECTION 1: Core Subject Notes */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Core Subject Notes</h2>
          </div>
          {isPlacementCoordinator && (
            <button
              onClick={() => setModalType('subject-note')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent-coral hover:bg-orange-600 text-foreground text-sm font-medium transition-all"
            >
              <Plus className="w-4 h-4" /> Add Note
            </button>
          )}
        </div>

        {resources.subjectNotes.length === 0 ? (
          <div className="rounded-2xl border border-border bg-background/40 p-8 text-center text-text-muted text-sm">
            No subject notes published yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.subjectNotes.map((note) => (
              <div
                key={note.id}
                className="group relative rounded-2xl border border-border bg-background/30 p-6 flex flex-col justify-between hover:border-accent-coral/30 hover:bg-background/50 transition-all duration-300 shadow-md"
              >
                <div>
                  <span className="text-xs text-accent-coral font-semibold tracking-wider uppercase mb-1 block">Subject Note</span>
                  <h3 className="text-lg font-bold text-foreground mb-4 group-hover:text-indigo-200 transition-colors truncate">
                    {note.subjectName}
                  </h3>
                </div>
                <div className="flex items-center justify-between mt-2 pt-4 border-t border-border">
                  <a
                    href={note.resourceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm font-semibold text-accent-coral hover:text-indigo-300 transition-colors"
                  >
                    Open Notes <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {isPlacementCoordinator && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit('subject-note', note)}
                        className="p-2 rounded-lg bg-surface hover:bg-white/10 text-text-muted transition-all"
                        title="Edit Resource"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ id: note.id, type: 'subject-note' })}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all"
                        title="Delete Resource"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: Previous Year Questions */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent-coral/10 text-accent-coral border border-accent-coral/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Previous Year Questions</h2>
          </div>
          {isPlacementCoordinator && (
            <button
              onClick={() => setModalType('prev-question')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent-coral hover:bg-orange-600 text-foreground text-sm font-medium transition-all"
            >
              <Plus className="w-4 h-4" /> Add Question Paper
            </button>
          )}
        </div>

        {resources.previousYearQuestions.length === 0 ? (
          <div className="rounded-2xl border border-border bg-background/40 p-8 text-center text-text-muted text-sm">
            No question papers published yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.previousYearQuestions.map((pq) => (
              <div
                key={pq.id}
                className="group relative rounded-2xl border border-border bg-background/30 p-6 flex flex-col justify-between hover:border-accent-coral/30 hover:bg-background/50 transition-all duration-300 shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs text-accent-coral font-semibold tracking-wider uppercase">PYQ Paper</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-accent-coral/10 text-violet-300 border border-accent-coral/20">
                      Sem {pq.semester}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-violet-200 transition-colors truncate">
                    {pq.subjectName}
                  </h3>
                  <p className="text-xs text-text-muted mt-1 mb-4">Exam Year: {pq.year}</p>
                </div>
                <div className="flex items-center justify-between mt-2 pt-4 border-t border-border">
                  <a
                    href={pq.questionPaperLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm font-semibold text-accent-coral hover:text-violet-300 transition-colors"
                  >
                    Open Question Paper <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {isPlacementCoordinator && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit('prev-question', pq)}
                        className="p-2 rounded-lg bg-surface hover:bg-white/10 text-text-muted transition-all"
                        title="Edit Resource"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ id: pq.id, type: 'prev-question' })}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all"
                        title="Delete Resource"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 3: Interview Notes */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Interview Notes</h2>
          </div>
          {isPlacementCoordinator && (
            <button
              onClick={() => setModalType('interview-note')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent-coral hover:bg-orange-600 text-foreground text-sm font-medium transition-all"
            >
              <Plus className="w-4 h-4" /> Add Topic Notes
            </button>
          )}
        </div>

        {resources.interviewNotes.length === 0 ? (
          <div className="rounded-2xl border border-border bg-background/40 p-8 text-center text-text-muted text-sm">
            No interview notes published yet.
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-background/20 p-6 space-y-4">
            {resources.interviewNotes.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-background/40 hover:border-sky-500/30 hover:bg-background/60 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-sky-400 shrink-0" />
                  <h3 className="font-bold text-slate-100 group-hover:text-foreground transition-colors">
                    {item.topicName}
                  </h3>
                </div>
                <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-start">
                  <a
                    href={item.interviewNotesLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm font-semibold text-sky-450 text-sky-400 hover:text-sky-300 transition-colors"
                  >
                    Open Notes <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {isPlacementCoordinator && (
                    <div className="flex items-center gap-2 border-l border-border pl-4">
                      <button
                        onClick={() => openEdit('interview-note', item)}
                        className="p-2 rounded-lg bg-surface hover:bg-white/10 text-text-muted transition-all"
                        title="Edit Resource"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ id: item.id, type: 'interview-note' })}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all"
                        title="Delete Resource"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 4: Cheat Sheets */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Cheat Sheets</h2>
          </div>
          {isPlacementCoordinator && (
            <button
              onClick={() => setModalType('cheat-sheet')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent-coral hover:bg-orange-600 text-foreground text-sm font-medium transition-all"
            >
              <Plus className="w-4 h-4" /> Add Cheat Sheet
            </button>
          )}
        </div>

        {resources.cheatSheets.length === 0 ? (
          <div className="rounded-2xl border border-border bg-background/40 p-8 text-center text-text-muted text-sm">
            No cheat sheets published yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.cheatSheets.map((cs) => (
              <div
                key={cs.id}
                className="group relative rounded-2xl border border-border bg-background/30 overflow-hidden flex flex-col justify-between hover:border-pink-500/30 hover:bg-background/50 transition-all duration-300 shadow-md"
              >
                {/* Visual Image container */}
                <div className="aspect-video w-full relative bg-background border-b border-border flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cs.imageUrl}
                    alt={cs.name}
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5 flex items-center justify-between gap-4">
                  <h3 className="font-bold text-slate-100 group-hover:text-foreground truncate">
                    {cs.name}
                  </h3>

                  {isPlacementCoordinator && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => openEdit('cheat-sheet', cs)}
                        className="p-2 rounded-lg bg-surface hover:bg-white/10 text-text-muted transition-all"
                        title="Edit Resource"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ id: cs.id, type: 'cheat-sheet' })}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all"
                        title="Delete Resource"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FORM DIALOG MODAL */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-background shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">
                {editMode ? 'Edit' : 'Add'} {modalType === 'subject-note' && 'Core Subject Note'}
                {modalType === 'prev-question' && 'Previous Year Question'}
                {modalType === 'interview-note' && 'Interview Note'}
                {modalType === 'cheat-sheet' && 'Cheat Sheet'}
              </h3>
              <button onClick={closeModal} className="text-text-muted hover:text-foreground text-sm font-medium transition-colors">
                Cancel
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Core Subject Note Fields */}
              {modalType === 'subject-note' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Subject Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. DBMS, Operating Systems"
                      value={subjectNoteForm.subjectName}
                      onChange={(e) => setSubjectNoteForm({ ...subjectNoteForm, subjectName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent-coral/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Resource Link</label>
                    <input
                      type="url"
                      required
                      placeholder="https://drive.google.com/..."
                      value={subjectNoteForm.resourceLink}
                      onChange={(e) => setSubjectNoteForm({ ...subjectNoteForm, resourceLink: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent-coral/50 transition-colors"
                    />
                  </div>
                </>
              )}

              {/* Previous Year Question Fields */}
              {modalType === 'prev-question' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Subject Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Database Management Systems"
                      value={prevQuestionForm.subjectName}
                      onChange={(e) => setPrevQuestionForm({ ...prevQuestionForm, subjectName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent-coral/50 transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Year</label>
                      <input
                        type="number"
                        required
                        min="1900"
                        max="2100"
                        value={prevQuestionForm.year}
                        onChange={(e) => setPrevQuestionForm({ ...prevQuestionForm, year: parseInt(e.target.value) || new Date().getFullYear() })}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent-coral/50 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Semester</label>
                      <input
                        type="number"
                        required
                        min="1"
                        max="10"
                        value={prevQuestionForm.semester}
                        onChange={(e) => setPrevQuestionForm({ ...prevQuestionForm, semester: parseInt(e.target.value) || 1 })}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent-coral/50 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Question Paper Link</label>
                    <input
                      type="url"
                      required
                      placeholder="https://drive.google.com/..."
                      value={prevQuestionForm.questionPaperLink}
                      onChange={(e) => setPrevQuestionForm({ ...prevQuestionForm, questionPaperLink: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent-coral/50 transition-colors"
                    />
                  </div>
                </>
              )}

              {/* Interview Note Fields */}
              {modalType === 'interview-note' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Topic Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. DBMS Interview Questions"
                      value={interviewNoteForm.topicName}
                      onChange={(e) => setInterviewNoteForm({ ...interviewNoteForm, topicName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent-coral/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Interview Notes Link</label>
                    <input
                      type="url"
                      required
                      placeholder="https://drive.google.com/..."
                      value={interviewNoteForm.interviewNotesLink}
                      onChange={(e) => setInterviewNoteForm({ ...interviewNoteForm, interviewNotesLink: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent-coral/50 transition-colors"
                    />
                  </div>
                </>
              )}

              {/* Cheat Sheet Fields */}
              {modalType === 'cheat-sheet' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Cheat Sheet Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. GitHub Cheat Sheet, Docker Cheat Sheet"
                      value={cheatSheetForm.name}
                      onChange={(e) => setCheatSheetForm({ ...cheatSheetForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent-coral/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">Cheat Sheet Image</label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface hover:bg-white/10 text-slate-200 text-sm font-medium border border-border cursor-pointer transition-all">
                        {isUploading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-indigo-405 text-accent-coral" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 text-text-muted" />
                            Choose Image
                          </>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                      </label>
                      {cheatSheetForm.imageUrl && (
                        <div className="w-16 h-10 rounded bg-background border border-border overflow-hidden relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={cheatSheetForm.imageUrl} alt="Preview" className="w-full h-full object-contain" />
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-border mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl bg-surface hover:bg-white/10 text-text-muted text-sm font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    isUploading ||
                    createSubjectNoteMutation.isPending ||
                    updateSubjectNoteMutation.isPending ||
                    createPrevQuestionMutation.isPending ||
                    updatePrevQuestionMutation.isPending ||
                    createInterviewNoteMutation.isPending ||
                    updateInterviewNoteMutation.isPending ||
                    createCheatSheetMutation.isPending ||
                    updateCheatSheetMutation.isPending
                  }
                  className="px-5 py-2 rounded-xl bg-accent-coral hover:bg-orange-600 disabled:opacity-50 text-foreground text-sm font-medium shadow-lg shadow-accent-coral/10 transition-all"
                >
                  Save Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border bg-background shadow-2xl p-6 space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-foreground">Delete Resource?</h3>
              <p className="text-text-muted text-sm">
                Are you sure you want to delete this resource? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl bg-surface hover:bg-white/10 text-text-muted text-sm font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={
                  deleteSubjectNoteMutation.isPending ||
                  deletePrevQuestionMutation.isPending ||
                  deleteInterviewNoteMutation.isPending ||
                  deleteCheatSheetMutation.isPending
                }
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-foreground text-sm font-medium shadow-lg shadow-rose-600/10 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
