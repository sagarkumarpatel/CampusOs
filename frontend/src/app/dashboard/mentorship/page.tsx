'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../../../lib/api';
import { useAuth } from '../../../providers/AuthProvider';
import { Search, Compass, User, MessageSquare, Calendar, Edit3, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface Mentor {
  id: string;
  userId: string;
  name: string;
  title: string;
  company: string;
  skills: string[];
  bio: string | null;
  linkedinUrl: string | null;
  calendlyUrl: string | null;
  avatarUrl: string | null;
}

interface OwnProfile {
  id: string;
  title: string;
  company: string;
  skills: string[];
  bio: string | null;
  linkedinUrl: string | null;
  calendlyUrl: string | null;
  isAvailable: boolean;
}

export default function MentorshipDirectory() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [message, setMessage] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Queries
  const { data: mentors, isLoading } = useQuery<Mentor[]>({
    queryKey: ['mentors-list'],
    queryFn: () => apiFetch('/mentors'),
  });

  const { data: ownProfile } = useQuery<OwnProfile | null>({
    queryKey: ['mentor-own-profile'],
    queryFn: () => apiFetch('/mentors/profile').catch(() => null),
    enabled: user?.role === 'MENTOR',
  });

  // Mutations
  const sendRequestMutation = useMutation({
    mutationFn: ({ mentorId, message }: { mentorId: string; message: string }) =>
      apiFetch(`/mentors/${mentorId}/request`, {
        method: 'POST',
        body: JSON.stringify({ message }),
      }),
    onSuccess: () => {
      alert('Request sent successfully!');
      setSelectedMentor(null);
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['mentors-requests'] });
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to send request. Check if a pending request already exists.');
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (profileData: Partial<OwnProfile>) =>
      apiFetch('/mentors/profile', {
        method: 'POST',
        body: JSON.stringify(profileData),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentor-own-profile'] });
      queryClient.invalidateQueries({ queryKey: ['mentors-list'] });
      setShowProfileModal(false);
    },
  });

  // Skills aggregation
  const allSkills = Array.from(
    new Set((mentors || []).flatMap((m) => m.skills || []))
  ).sort();

  // Filtered listing — search also matches skill tags
  const filteredMentors = (mentors || []).filter((m) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.company.toLowerCase().includes(q) ||
      m.title.toLowerCase().includes(q) ||
      m.skills.some((s) => s.toLowerCase().includes(q));
    const matchesSkill = selectedSkill ? m.skills.includes(selectedSkill) : true;
    return matchesSearch && matchesSkill;
  });

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentor) return;
    sendRequestMutation.mutate({ mentorId: selectedMentor.id, message });
  };

  const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const skillsString = formData.get('skills') as string;
    const skills = skillsString ? skillsString.split(',').map((s) => s.trim()).filter(Boolean) : [];

    updateProfileMutation.mutate({
      title: formData.get('title') as string,
      company: formData.get('company') as string,
      bio: formData.get('bio') as string,
      linkedinUrl: formData.get('linkedinUrl') as string,
      calendlyUrl: formData.get('calendlyUrl') as string,
      skills,
      isAvailable: formData.get('isAvailable') === 'true',
    });
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto">
      {/* Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-violet-900 via-indigo-950 to-slate-950 border border-violet-500/20 relative overflow-hidden shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Mentorship Hub</h1>
          <p className="text-slate-300 text-sm max-w-xl font-light">
            Connect with experienced seniors and mentors. Schedule sessions, review resumes, and get roadmap advice.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <Link
            href="/dashboard/mentorship/requests"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-all border border-white/10"
          >
            My Requests
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Mentor profile settings toggle */}
          {user?.role === 'MENTOR' && (
            <button
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm transition-all"
            >
              <Edit3 className="w-4 h-4" />
              Configure Mentor Profile
            </button>
          )}
        </div>
      </div>

      {/* Directory Search Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search mentors by name, company, or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:border-violet-500/50 text-sm"
          />
        </div>

        <select
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-300 text-sm focus:outline-none focus:border-violet-500/50"
        >
          <option value="" className="bg-slate-900 text-slate-300">All Skills</option>
          {allSkills.map((skill) => (
            <option key={skill} value={skill} className="bg-slate-900 text-slate-200">
              {skill}
            </option>
          ))}
        </select>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.length === 0 ? (
          <div className="col-span-full text-center py-16 text-slate-500">
            <Compass className="w-12 h-12 mx-auto mb-4 opacity-35" />
            No mentors found matching your filters.
          </div>
        ) : (
          filteredMentors.map((mentor) => (
            <div
              key={mentor.id}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between hover:bg-white/10 hover:border-violet-500/30 transition-all group h-72"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-lg font-bold text-violet-400 shrink-0">
                    {mentor.avatarUrl ? (
                      <img src={mentor.avatarUrl} alt={mentor.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>
                  <div className="overflow-hidden flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white truncate">{mentor.name}</h3>
                      {mentor.userId === user?.id && (
                        <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30">YOU</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate">{mentor.title} @ <span className="font-semibold text-violet-400">{mentor.company}</span></p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4 font-light">
                  {mentor.bio || 'No bio provided.'}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {mentor.skills.slice(0, 3).map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/5 border border-white/10 text-slate-300">
                      {s}
                    </span>
                  ))}
                  {mentor.skills.length > 3 && (
                    <span className="text-[10px] text-slate-500 pt-0.5">+{mentor.skills.length - 3} more</span>
                  )}
                </div>

                <div className="flex justify-between items-center gap-4 border-t border-white/5 pt-4">
                  <div className="flex items-center gap-2">
                    {mentor.linkedinUrl && (
                      <a href={mentor.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                        <LinkedinIcon className="w-4 h-4" />
                      </a>
                    )}
                    {mentor.calendlyUrl && (
                      <a href={mentor.calendlyUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                        <Calendar className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {mentor.userId === user?.id ? (
                    <span className="px-4 py-2 rounded-xl bg-white/3 border border-white/5 text-xs font-semibold text-slate-500 cursor-default">
                      Your Profile
                    </span>
                  ) : (
                    <button
                      onClick={() => setSelectedMentor(mentor)}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-violet-600 hover:text-white border border-white/10 group-hover:border-violet-500/30 text-xs font-semibold transition-all text-slate-300"
                    >
                      Request Session
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Mentor Profile setup modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-950 border border-white/10 p-8 rounded-2xl relative space-y-6">
            <button onClick={() => setShowProfileModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-white">Mentor Profile Configurations</h2>
              <p className="text-xs text-slate-400">Fill in your professional parameters for seekers.</p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300">Designation / Title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    defaultValue={ownProfile?.title || ''}
                    placeholder="e.g. Software Engineer"
                    className="w-full px-3 py-2 rounded-lg bg-black/35 border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300">Company</label>
                  <input
                    type="text"
                    name="company"
                    required
                    defaultValue={ownProfile?.company || ''}
                    placeholder="e.g. Google"
                    className="w-full px-3 py-2 rounded-lg bg-black/35 border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300">Skills (Comma-separated)</label>
                <input
                  type="text"
                  name="skills"
                  required
                  defaultValue={ownProfile?.skills?.join(', ') || ''}
                  placeholder="React, Node.js, System Design"
                  className="w-full px-3 py-2 rounded-lg bg-black/35 border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300">Bio</label>
                <textarea
                  name="bio"
                  rows={3}
                  defaultValue={ownProfile?.bio || ''}
                  placeholder="Write a brief intro about yourself..."
                  className="w-full px-3 py-2 rounded-lg bg-black/35 border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300">LinkedIn Profile Link</label>
                  <input
                    type="url"
                    name="linkedinUrl"
                    defaultValue={ownProfile?.linkedinUrl || ''}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3 py-2 rounded-lg bg-black/35 border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300">Calendly / Session Link</label>
                  <input
                    type="url"
                    name="calendlyUrl"
                    defaultValue={ownProfile?.calendlyUrl || ''}
                    placeholder="https://calendly.com/..."
                    className="w-full px-3 py-2 rounded-lg bg-black/35 border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300">Availability Status</label>
                <select
                  name="isAvailable"
                  defaultValue={ownProfile ? String(ownProfile.isAvailable) : 'true'}
                  className="w-full px-3 py-2 rounded-lg bg-black/35 border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="true">Available for sessions</option>
                  <option value="false">Unavailable</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="w-full py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 font-semibold text-sm transition-all"
              >
                Save configurations
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Send Mentorship Request Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-950 border border-white/10 rounded-2xl relative overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/5">
              <button onClick={() => { setSelectedMentor(null); setMessage(''); }} className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Request a Session with {selectedMentor.name}</h2>
                  <p className="text-xs text-slate-400">{selectedMentor.title} @ {selectedMentor.company}</p>
                </div>
              </div>
            </div>

            {/* How it works */}
            <div className="mx-6 mt-5 p-4 rounded-xl bg-violet-500/5 border border-violet-500/15 space-y-2">
              <p className="text-[11px] font-bold text-violet-400 uppercase tracking-wider">How it works</p>
              <div className="space-y-1.5">
                <div className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="shrink-0 w-4 h-4 rounded-full bg-violet-500/20 text-violet-400 text-[10px] font-bold flex items-center justify-center mt-px">1</span>
                  Write a clear message explaining what kind of help you need
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="shrink-0 w-4 h-4 rounded-full bg-violet-500/20 text-violet-400 text-[10px] font-bold flex items-center justify-center mt-px">2</span>
                  The mentor will review and <span className="text-emerald-400 font-semibold mx-0.5">Accept</span> or <span className="text-rose-400 font-semibold mx-0.5">Decline</span> your request
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="shrink-0 w-4 h-4 rounded-full bg-violet-500/20 text-violet-400 text-[10px] font-bold flex items-center justify-center mt-px">3</span>
                  If accepted, their LinkedIn profile link will be shared with you to connect
                </div>
              </div>
            </div>

            <form onSubmit={handleRequestSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Your Message to {selectedMentor.name}</label>
                <textarea
                  required
                  rows={5}
                  minLength={20}
                  placeholder={`Hi ${selectedMentor.name}, I'm looking for guidance on...\n\n• What specific area do you need help with?\n• What is your current level?\n• What is your goal?`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/60 resize-none leading-relaxed"
                />
                <p className="text-[10px] text-slate-500">{message.length}/500 characters. Be specific — mentors are more likely to accept detailed requests.</p>
              </div>

              <button
                type="submit"
                disabled={sendRequestMutation.isPending || message.length < 20}
                className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                {sendRequestMutation.isPending ? 'Sending...' : 'Send Request to Mentor'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
