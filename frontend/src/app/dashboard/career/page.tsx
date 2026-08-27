'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch, getAccessToken } from '../../../lib/api';
import { useAuth } from '../../../providers/AuthProvider';
import {
  Briefcase,
  MapPin,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  Download,
  Search,
  Filter,
  Image as ImageIcon,
  CheckSquare,
  Square,
  Users,
} from 'lucide-react';

interface CareerOpportunity {
  id: string;
  companyName: string;
  role: string;
  jobType: 'INTERNSHIP' | 'FULL_TIME_JOB' | 'FREELANCE_OPPORTUNITY';
  location: string;
  stipendPerMonth: number;
  applicationLink: string;
  bannerImageUrl: string;
  createdAt: string;
  updatedAt: string;
  registrationCount: number;
  hasRegistered: boolean;
}

export default function CareerTrackingPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isCoordinator = user?.role === 'PLACEMENT_COORDINATOR';

  // Filters state
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Form modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<CareerOpportunity | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Form fields
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [jobType, setJobType] = useState<'INTERNSHIP' | 'FULL_TIME_JOB' | 'FREELANCE_OPPORTUNITY'>('INTERNSHIP');
  const [location, setLocation] = useState('');
  const [stipendPerMonth, setStipendPerMonth] = useState('');
  const [applicationLink, setApplicationLink] = useState('');
  const [bannerImageUrl, setBannerImageUrl] = useState('');

  // Delete modal state
  const [deletingOpportunity, setDeletingOpportunity] = useState<CareerOpportunity | null>(null);

  // Fetch opportunities
  const { data: opportunities = [], isLoading } = useQuery<CareerOpportunity[]>({
    queryKey: ['career-opportunities'],
    queryFn: async () => {
      const res = await apiFetch('/career');
      return res;
    },
  });

  // Image upload mutation
  const uploadBannerMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('banner', file);

      // Raw fetch for multipart/form-data — must pass Bearer token explicitly
      // because we cannot set Content-Type manually (browser sets boundary automatically)
      const token = getAccessToken() || '';
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/career/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Banner upload failed');
      }

      return res.json();
    },
    onMutate: () => {
      setIsUploading(true);
      setFormError(null);
    },
    onSuccess: (data) => {
      setBannerImageUrl(data.imageUrl);
      setIsUploading(false);
    },
    onError: (err: any) => {
      setFormError(err.message);
      setIsUploading(false);
    },
  });

  // Create/Update mutations
  const saveOpportunityMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        companyName,
        role,
        jobType,
        location,
        stipendPerMonth: parseInt(stipendPerMonth, 10),
        applicationLink,
        bannerImageUrl,
      };

      if (editingOpportunity) {
        return apiFetch(`/career/${editingOpportunity.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        return apiFetch('/career', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['career-opportunities'] });
      closeFormModal();
    },
    onError: (err: any) => {
      setFormError(err.message || 'Failed to save opportunity');
    },
  });

  // Delete mutation
  const deleteOpportunityMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiFetch(`/career/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['career-opportunities'] });
      setDeletingOpportunity(null);
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to delete opportunity');
    },
  });

  // Registration toggle mutation
  const toggleRegistrationMutation = useMutation({
    mutationFn: async ({ id, registered }: { id: string; registered: boolean }) => {
      if (registered) {
        return apiFetch(`/career/${id}/register`, {
          method: 'DELETE',
        });
      } else {
        return apiFetch(`/career/${id}/register`, {
          method: 'POST',
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['career-opportunities'] });
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to toggle registration');
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadBannerMutation.mutate(e.target.files[0]);
    }
  };

  const openFormModal = (op: CareerOpportunity | null = null) => {
    setFormError(null);
    if (op) {
      setEditingOpportunity(op);
      setCompanyName(op.companyName);
      setRole(op.role);
      setJobType(op.jobType);
      setLocation(op.location);
      setStipendPerMonth(op.stipendPerMonth.toString());
      setApplicationLink(op.applicationLink);
      setBannerImageUrl(op.bannerImageUrl);
    } else {
      setEditingOpportunity(null);
      setCompanyName('');
      setRole('');
      setJobType('INTERNSHIP');
      setLocation('');
      setStipendPerMonth('');
      setApplicationLink('');
      setBannerImageUrl('');
    }
    setIsFormOpen(true);
  };

  const closeFormModal = () => {
    setIsFormOpen(false);
    setEditingOpportunity(null);
    setFormError(null);
  };

  const handleDownload = async (op: CareerOpportunity) => {
    try {
      const token = getAccessToken() || '';
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/career/${op.id}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to download registered student list');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${op.companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${op.role.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-registered-students.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      alert(error.message || 'Failed to download registered students');
    }
  };

  // Filter & search logic
  const filteredOpportunities = opportunities.filter((op) => {
    const matchesType = selectedType === 'All' || op.jobType === selectedType;
    const matchesSearch =
      op.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getJobTypeLabel = (type: string) => {
    switch (type) {
      case 'INTERNSHIP':
        return 'Internship';
      case 'FULL_TIME_JOB':
        return 'Full-Time Job';
      case 'FREELANCE_OPPORTUNITY':
        return 'Freelance';
      default:
        return type;
    }
  };

  const getJobTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'INTERNSHIP':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'FULL_TIME_JOB':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'FREELANCE_OPPORTUNITY':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-slate-500/10 text-text-muted border-slate-500/20';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 overflow-y-auto h-[calc(100vh-64px)]">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-accent-coral" />
            Career Tracking
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Discover internships, jobs, and freelance opportunities posted by your Placement Coordinator.
          </p>
        </div>

        {isCoordinator && (
          <button
            onClick={() => openFormModal()}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-accent-coral to-accent-coral hover:from-accent-coral hover:to-orange-600 text-foreground rounded-xl font-medium shadow-lg shadow-accent-coral/10 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            Publish Opportunity
          </button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 rounded-2xl bg-surface border border-border">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search company or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-background/50 border border-border text-foreground placeholder-slate-400 focus:outline-none focus:border-accent-coral/50 text-sm"
          />
        </div>

        {/* Categories Tab Filters */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {['All', 'INTERNSHIP', 'FULL_TIME_JOB', 'FREELANCE_OPPORTUNITY'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-semibold tracking-wide transition-all ${
                selectedType === type
                  ? 'bg-accent-coral border-accent-coral text-foreground shadow-lg shadow-accent-coral/20'
                  : 'bg-surface border-border text-text-muted hover:bg-white/10'
              }`}
            >
              {type === 'All' ? 'All Opportunities' : getJobTypeLabel(type)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      {isLoading ? (
        <div className="text-center py-20 text-text-muted">Loading opportunities...</div>
      ) : filteredOpportunities.length === 0 ? (
        <div className="text-center py-24 rounded-2xl bg-surface border border-border border-dashed text-text-muted">
          <Briefcase className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <p className="text-sm font-medium">No opportunities found</p>
          <p className="text-xs text-text-muted mt-1">Try refining your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.map((op) => (
            <div
              key={op.id}
              className="rounded-2xl bg-surface border border-border hover:border-accent-coral/30 overflow-hidden flex flex-col justify-between transition-all group"
            >
              {/* Banner */}
              <div className="relative h-44 bg-background flex items-center justify-center overflow-hidden">
                {op.bannerImageUrl ? (
                  <img
                    src={op.bannerImageUrl}
                    alt={op.companyName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-accent-coral to-orange-400 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-foreground/20" />
                  </div>
                )}
                
                <span className={`absolute top-4 right-4 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getJobTypeBadgeColor(op.jobType)}`}>
                  {getJobTypeLabel(op.jobType)}
                </span>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-foreground tracking-tight line-clamp-1">{op.role}</h3>
                  <p className="text-accent-coral font-semibold text-sm tracking-wide mt-1">{op.companyName}</p>

                  <div className="mt-4 space-y-2 text-xs text-text-muted">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-text-muted shrink-0" />
                      <span>{op.location}</span>
                    </div>
                    <div className="flex items-center gap-2 font-medium">
                      <span className="text-text-muted">Stipend / Salary:</span>
                      <span className="text-foreground font-semibold">₹{op.stipendPerMonth.toLocaleString()} / month</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="flex justify-between items-center text-xs">
                    {/* User registered indicator */}
                    <button
                      onClick={() =>
                        toggleRegistrationMutation.mutate({
                          id: op.id,
                          registered: op.hasRegistered,
                        })
                      }
                      className="flex items-center gap-2 hover:text-foreground transition-colors"
                    >
                      {op.hasRegistered ? (
                        <CheckSquare className="w-5 h-5 text-accent-coral" />
                      ) : (
                        <Square className="w-5 h-5 text-text-muted hover:text-text-muted" />
                      )}
                      <span className={op.hasRegistered ? 'text-accent-coral font-semibold' : 'text-text-muted'}>
                        Registered
                      </span>
                    </button>

                    <div className="flex items-center gap-1 text-text-muted">
                      <Users className="w-3.5 h-3.5" />
                      <span>{op.registrationCount} {op.registrationCount === 1 ? 'Student' : 'Students'}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {/* Apply Button */}
                    <a
                      href={op.applicationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-background border border-border hover:border-border text-foreground rounded-xl text-xs font-semibold transition-all"
                    >
                      Apply
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    {/* Coordinator operations */}
                    {isCoordinator && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleDownload(op)}
                          title="Download registered student emails"
                          className="p-2.5 bg-background border border-border hover:border-accent-coral/30 text-text-muted hover:text-accent-coral rounded-xl transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openFormModal(op)}
                          title="Edit"
                          className="p-2.5 bg-background border border-border hover:border-accent-coral/30 text-text-muted hover:text-accent-coral rounded-xl transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingOpportunity(op)}
                          title="Delete"
                          className="p-2.5 bg-background border border-border hover:border-rose-500/30 text-text-muted hover:text-rose-400 rounded-xl transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Opportunity Add/Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-background border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="text-xl font-bold text-foreground">
                {editingOpportunity ? 'Edit Career Opportunity' : 'Publish Career Opportunity'}
              </h2>
              <button onClick={closeFormModal} className="text-text-muted hover:text-foreground text-sm">
                Cancel
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {formError && (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/25 text-rose-400 rounded-xl text-xs font-semibold">
                  {formError}
                </div>
              )}

              {/* Banner upload */}
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                  Company Banner
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-28 h-20 bg-background border border-border rounded-xl overflow-hidden flex items-center justify-center">
                    {bannerImageUrl ? (
                      <img src={bannerImageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-600" />
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      id="banner-file"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="banner-file"
                      className={`inline-flex items-center gap-1.5 px-4 py-2.5 bg-surface hover:bg-white/10 border border-border text-foreground rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                        isUploading ? 'opacity-50 pointer-events-none' : ''
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      {isUploading ? 'Uploading...' : 'Choose Image'}
                    </label>
                    <p className="text-[10px] text-text-muted mt-1">Recommended: PNG/JPG banners (max 5MB)</p>
                  </div>
                </div>
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                  Company Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Google"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder-slate-500 focus:outline-none focus:border-accent-coral/50 text-sm"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Role</label>
                <input
                  type="text"
                  placeholder="e.g. Software Engineering Intern"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder-slate-500 focus:outline-none focus:border-accent-coral/50 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Job Type */}
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                    Job Type
                  </label>
                  <select
                    value={jobType}
                    onChange={(e: any) => setJobType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-accent-coral/50 text-sm"
                  >
                    <option value="INTERNSHIP">Internship</option>
                    <option value="FULL_TIME_JOB">Full-Time Job</option>
                    <option value="FREELANCE_OPPORTUNITY">Freelance</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bangalore, India"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder-slate-500 focus:outline-none focus:border-accent-coral/50 text-sm"
                  />
                </div>
              </div>

              {/* Stipend per Month */}
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                  Stipend per Month (INR)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 40000"
                  value={stipendPerMonth}
                  onChange={(e) => setStipendPerMonth(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder-slate-500 focus:outline-none focus:border-accent-coral/50 text-sm"
                />
              </div>

              {/* Application Link */}
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                  Application Link
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/apply"
                  value={applicationLink}
                  onChange={(e) => setApplicationLink(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder-slate-500 focus:outline-none focus:border-accent-coral/50 text-sm"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-border flex gap-3">
              <button
                type="button"
                onClick={closeFormModal}
                className="flex-1 py-3 border border-border hover:bg-surface text-text-muted rounded-xl font-medium transition-all text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => saveOpportunityMutation.mutate()}
                disabled={saveOpportunityMutation.isPending || isUploading}
                className="flex-1 py-3 bg-gradient-to-r from-accent-coral to-accent-coral hover:from-accent-coral hover:to-orange-600 text-foreground rounded-xl font-medium shadow-lg shadow-accent-coral/10 transition-all text-sm disabled:opacity-50"
              >
                {saveOpportunityMutation.isPending ? 'Saving...' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingOpportunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-background border border-border p-6 shadow-2xl space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-foreground">Delete Opportunity?</h3>
              <p className="text-sm text-text-muted leading-normal">
                Are you sure you want to delete this opportunity for <strong>{deletingOpportunity.companyName}</strong>?
                This will also permanently clear all student registrations for this post.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setDeletingOpportunity(null)}
                className="flex-1 py-2.5 border border-border hover:bg-surface text-text-muted rounded-xl text-xs font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteOpportunityMutation.mutate(deletingOpportunity.id)}
                disabled={deleteOpportunityMutation.isPending}
                className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-foreground rounded-xl text-xs font-semibold transition-all"
              >
                {deleteOpportunityMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
