'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../../../../lib/api';
import { useAuth } from '../../../../providers/AuthProvider';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Loader2
} from 'lucide-react';

interface DsaCategory {
  id: string;
  name: string;
  description: string;
  totalProblems: number;
  solvedProblems: number;
  remainingProblems: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
  progressPercent: number;
}

interface DsaProblem {
  id: string;
  problemName: string;
  problemLink: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  completed: boolean;
}

export default function DsaTrackerPage() {
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form states
  const [selectedProblem, setSelectedProblem] = useState<DsaProblem | null>(null);
  const [problemName, setProblemName] = useState('');
  const [problemLink, setProblemLink] = useState('');
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formError, setFormError] = useState('');

  // Fetch categories
  const { data: categories, isLoading: isCategoriesLoading } = useQuery<DsaCategory[], Error>({
    queryKey: ['dsa-categories'],
    queryFn: () => apiFetch('/dsa/categories'),
    enabled: !loading && !!user,
  });

  // Automatically select/expand first category if none active
  const hasInitialized = React.useRef(false);
  React.useEffect(() => {
    if (categories && categories.length > 0 && !hasInitialized.current) {
      setExpandedCategoryId(categories[0].id);
      hasInitialized.current = true;
    }
  }, [categories]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategoryId(expandedCategoryId === categoryId ? null : categoryId);
  };

  const resetForm = () => {
    setProblemName('');
    setProblemLink('');
    setDifficulty('MEDIUM');
    setFormError('');
  };

  const handleOpenAdd = (categoryId?: string) => {
    resetForm();
    if (categoryId) {
      setFormCategoryId(categoryId);
    } else if (expandedCategoryId) {
      setFormCategoryId(expandedCategoryId);
    } else if (categories && categories.length > 0) {
      setFormCategoryId(categories[0].id);
    }
    setShowAddModal(true);
  };

  const handleOpenEdit = (prob: DsaProblem, categoryId: string) => {
    resetForm();
    setSelectedProblem(prob);
    setProblemName(prob.problemName);
    setProblemLink(prob.problemLink);
    setDifficulty(prob.difficulty);
    setFormCategoryId(categoryId);
    setShowEditModal(true);
  };

  const handleOpenDelete = (prob: DsaProblem) => {
    setSelectedProblem(prob);
    setShowDeleteConfirm(true);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/dashboard/placement"
            className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 mb-2 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Placement Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">DSA Practice Tracker</h1>
          <p className="text-slate-400 text-sm font-light">
            Keep track of your coding progress across dynamic programming, graphs, trees, and other core algorithms.
          </p>
        </div>

        <button
          onClick={() => handleOpenAdd()}
          className="px-5 py-3 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-violet-600/20 flex items-center justify-center gap-2 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" /> Add Problem
        </button>
      </div>

      {/* Accordion Topics List */}
      <div className="space-y-4">
        {isCategoriesLoading ? (
          <div className="p-12 text-center text-slate-500 bg-white/5 border border-white/10 rounded-3xl">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-violet-400" />
            <p className="text-sm">Loading topics...</p>
          </div>
        ) : (
          categories?.map((cat) => {
            const isExpanded = cat.id === expandedCategoryId;
            return (
              <div
                key={cat.id}
                className={`rounded-3xl border transition-all overflow-hidden ${
                  isExpanded
                    ? 'bg-white/5 border-violet-500/30 shadow-xl'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
                }`}
              >
                {/* Accordion Header Row */}
                <button
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full text-left p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 cursor-pointer"
                >
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-violet-300">
                        {cat.name}
                      </h3>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-violet-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-light truncate max-w-2xl">
                      {cat.description}
                    </p>
                  </div>

                  {/* Progress & Stats Area */}
                  <div className="flex flex-wrap items-center gap-6 lg:self-center">
                    <div className="flex gap-2 text-[10px] text-slate-400">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-semibold">
                        {cat.easySolved} / {cat.easyCount} Easy
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 font-semibold">
                        {cat.mediumSolved} / {cat.mediumCount} Medium
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 font-semibold">
                        {cat.hardSolved} / {cat.hardCount} Hard
                      </span>
                    </div>

                    <div className="flex items-center gap-3 min-w-[180px]">
                      <div className="flex-1 bg-white/10 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
                          style={{ width: `${cat.progressPercent}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-white min-w-[28px] text-right">
                        {cat.progressPercent}%
                      </span>
                    </div>

                    <div className="text-xs font-medium text-slate-300 border-l border-white/10 pl-6 hidden sm:block">
                      {cat.solvedProblems} / {cat.totalProblems} Solved
                    </div>
                  </div>
                </button>

                {/* Accordion Content Row */}
                {isExpanded && (
                  <div className="border-t border-white/5 bg-slate-950/20 p-6">
                    <ProblemsListSection
                      categoryId={cat.id}
                      onEdit={(prob) => handleOpenEdit(prob, cat.id)}
                      onDelete={handleOpenDelete}
                      onAdd={() => handleOpenAdd(cat.id)}
                      queryClient={queryClient}
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Dialog */}
      {showAddModal && (
        <AddProblemModal
          categoryId={formCategoryId}
          categories={categories || []}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['dsa-categories'] });
            queryClient.invalidateQueries({ queryKey: ['dsa-dashboard-stats'] });
            setShowAddModal(false);
          }}
        />
      )}

      {/* Edit Dialog */}
      {showEditModal && selectedProblem && (
        <EditProblemModal
          problem={selectedProblem}
          categoryId={formCategoryId}
          categories={categories || []}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['dsa-categories'] });
            queryClient.invalidateQueries({ queryKey: ['dsa-dashboard-stats'] });
            setShowEditModal(false);
          }}
        />
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && selectedProblem && (
        <DeleteProblemModal
          problem={selectedProblem}
          onClose={() => setShowDeleteConfirm(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['dsa-categories'] });
            queryClient.invalidateQueries({ queryKey: ['dsa-dashboard-stats'] });
            setShowDeleteConfirm(false);
            setSelectedProblem(null);
          }}
        />
      )}
    </div>
  );
}

// Sub-component to fetch and render problems inside expanded accordion
function ProblemsListSection({
  categoryId,
  onEdit,
  onDelete,
  onAdd,
  queryClient
}: {
  categoryId: string;
  onEdit: (prob: DsaProblem) => void;
  onDelete: (prob: DsaProblem) => void;
  onAdd: () => void;
  queryClient: any;
}) {
  const { data: problems, isLoading } = useQuery<DsaProblem[]>({
    queryKey: ['dsa-problems', categoryId],
    queryFn: () => apiFetch(`/dsa/categories/${categoryId}/problems`),
    enabled: !!categoryId,
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      apiFetch(`/dsa/problems/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ completed }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dsa-problems', categoryId] });
      queryClient.invalidateQueries({ queryKey: ['dsa-categories'] });
      queryClient.invalidateQueries({ queryKey: ['dsa-dashboard-stats'] });
    }
  });

  if (isLoading) {
    return (
      <div className="py-8 text-center text-slate-500">
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-violet-400" />
        <p className="text-xs">Loading problems...</p>
      </div>
    );
  }

  if (!problems || problems.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500 border-2 border-dashed border-white/5 rounded-2xl">
        <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-600" />
        <p className="text-xs">No problems added to this topic yet.</p>
        <button
          onClick={onAdd}
          className="mt-3 text-xs font-semibold text-violet-400 hover:text-violet-300"
        >
          Add the first problem
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            <th className="py-3 px-4 w-12 text-center font-bold">Solved</th>
            <th className="py-3 px-4">Problem Name</th>
            <th className="py-3 px-4 w-28">Difficulty</th>
            <th className="py-3 px-4 w-24 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-sm">
          {problems.map((prob) => (
            <tr key={prob.id} className="hover:bg-white/[0.02] transition-colors group">
              <td className="py-4 px-4 text-center">
                <input
                  type="checkbox"
                  checked={prob.completed}
                  onChange={(e) =>
                    toggleStatusMutation.mutate({
                      id: prob.id,
                      completed: e.target.checked
                    })
                  }
                  className="w-4.5 h-4.5 rounded border-white/10 text-violet-600 bg-slate-900 focus:ring-violet-500 cursor-pointer"
                />
              </td>
              <td className="py-4 px-4">
                <a
                  href={prob.problemLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-white hover:text-violet-400 transition-colors inline-flex items-center gap-1.5"
                >
                  {prob.problemName}
                  <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                </a>
              </td>
              <td className="py-4 px-4">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold inline-block ${
                    prob.difficulty === 'EASY'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : prob.difficulty === 'MEDIUM'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-rose-500/10 text-rose-400'
                  }`}
                >
                  {prob.difficulty}
                </span>
              </td>
              <td className="py-4 px-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(prob)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(prob)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Dialog Component: Add Problem
function AddProblemModal({
  categoryId,
  categories,
  onClose,
  onSuccess
}: {
  categoryId: string;
  categories: DsaCategory[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const queryClient = useQueryClient();
  const [problemName, setProblemName] = useState('');
  const [problemLink, setProblemLink] = useState('');
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
  const [formCategoryId, setFormCategoryId] = useState(categoryId);
  const [formError, setFormError] = useState('');

  const addProblemMutation = useMutation({
    mutationFn: (newProblem: { problemName: string; problemLink: string; difficulty: string; categoryId: string }) =>
      apiFetch('/dsa/problems', {
        method: 'POST',
        body: JSON.stringify(newProblem),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['dsa-problems', formCategoryId] });
      onSuccess();
    },
    onError: (err: any) => {
      setFormError(err.message || 'Failed to add problem');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemName.trim() || !problemLink.trim() || !formCategoryId) {
      setFormError('Please fill in all fields');
      return;
    }
    addProblemMutation.mutate({
      problemName,
      problemLink,
      difficulty,
      categoryId: formCategoryId
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 p-6 rounded-3xl max-w-md w-full space-y-4">
        <h3 className="text-xl font-bold text-white">Add Problem</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Problem Name</label>
            <input
              type="text"
              value={problemName}
              onChange={(e) => setProblemName(e.target.value)}
              placeholder="e.g. Two Sum"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500/50"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Problem Link</label>
            <input
              type="url"
              value={problemLink}
              onChange={(e) => setProblemLink(e.target.value)}
              placeholder="https://leetcode.com/problems/..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500/50"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500/50"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Category</label>
              <select
                value={formCategoryId}
                onChange={(e) => setFormCategoryId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500/50"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {formError && <p className="text-xs text-rose-400">{formError}</p>}

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addProblemMutation.isPending}
              className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-all"
            >
              {addProblemMutation.isPending ? 'Adding...' : 'Add Problem'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Dialog Component: Edit Problem
function EditProblemModal({
  problem,
  categoryId,
  categories,
  onClose,
  onSuccess
}: {
  problem: DsaProblem;
  categoryId: string;
  categories: DsaCategory[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const queryClient = useQueryClient();
  const [problemName, setProblemName] = useState(problem.problemName);
  const [problemLink, setProblemLink] = useState(problem.problemLink);
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>(problem.difficulty);
  const [formCategoryId, setFormCategoryId] = useState(categoryId);
  const [formError, setFormError] = useState('');

  const editProblemMutation = useMutation({
    mutationFn: (updated: { id: string; problemName: string; problemLink: string; difficulty: string; categoryId: string }) =>
      apiFetch(`/dsa/problems/${updated.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          problemName: updated.problemName,
          problemLink: updated.problemLink,
          difficulty: updated.difficulty,
          categoryId: updated.categoryId,
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dsa-problems', categoryId] });
      if (formCategoryId !== categoryId) {
        queryClient.invalidateQueries({ queryKey: ['dsa-problems', formCategoryId] });
      }
      onSuccess();
    },
    onError: (err: any) => {
      setFormError(err.message || 'Failed to update problem');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemName.trim() || !problemLink.trim() || !formCategoryId) {
      setFormError('Please fill in all fields');
      return;
    }
    editProblemMutation.mutate({
      id: problem.id,
      problemName,
      problemLink,
      difficulty,
      categoryId: formCategoryId
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 p-6 rounded-3xl max-w-md w-full space-y-4">
        <h3 className="text-xl font-bold text-white">Edit Problem</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Problem Name</label>
            <input
              type="text"
              value={problemName}
              onChange={(e) => setProblemName(e.target.value)}
              placeholder="e.g. Two Sum"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500/50"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Problem Link</label>
            <input
              type="url"
              value={problemLink}
              onChange={(e) => setProblemLink(e.target.value)}
              placeholder="https://leetcode.com/problems/..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500/50"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500/50"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Category</label>
              <select
                value={formCategoryId}
                onChange={(e) => setFormCategoryId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500/50"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {formError && <p className="text-xs text-rose-400">{formError}</p>}

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={editProblemMutation.isPending}
              className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-all"
            >
              {editProblemMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Dialog Component: Delete Problem
function DeleteProblemModal({
  problem,
  onClose,
  onSuccess
}: {
  problem: DsaProblem;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const queryClient = useQueryClient();
  const deleteProblemMutation = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/dsa/problems/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dsa-problems'] });
      onSuccess();
    }
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 p-6 rounded-3xl max-w-sm w-full space-y-4">
        <h3 className="text-xl font-bold text-white">Delete Problem</h3>
        <p className="text-sm text-slate-400 font-light">
          Are you sure you want to permanently delete <span className="font-semibold text-white">"{problem.problemName}"</span>?
        </p>

        <div className="flex gap-3 justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => deleteProblemMutation.mutate(problem.id)}
            disabled={deleteProblemMutation.isPending}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-all"
          >
            {deleteProblemMutation.isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
