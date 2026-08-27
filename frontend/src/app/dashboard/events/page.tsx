'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch, getAccessToken } from '../../../lib/api';
import { useAuth } from '../../../providers/AuthProvider';
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Plus,
  Trash2,
  Filter,
  Image as ImageIcon,
  Users,
  Search,
  BookOpen,
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  bannerImageUrl: string;
  category: 'HACKATHON' | 'WORKSHOP' | 'TECHNICAL_EVENT' | 'CODING_CONTEST';
  organizer: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  registrationDeadline: string;
  maximumParticipants: number;
  registrationLink: string;
  createdBy: string;
  createdAt: string;
}

export default function EventsPage() {
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Detail view state
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Form modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formError, setFormError] = useState('');

  // Form fields
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    bannerImageUrl: '',
    category: 'HACKATHON',
    organizer: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    registrationDeadline: '',
    maximumParticipants: '',
    registrationLink: '',
  });

  // Queries
  const { data: upcomingEvents = [], isLoading: isLoadingUpcoming } = useQuery<Event[]>({
    queryKey: ['events-upcoming'],
    queryFn: () => apiFetch('/events/upcoming'),
    enabled: !loading && !!user,
  });

  const { data: pastEvents = [], isLoading: isLoadingPast } = useQuery<Event[]>({
    queryKey: ['events-past'],
    queryFn: () => apiFetch('/events/past'),
    enabled: !loading && !!user,
  });

  // Create Event Mutation
  const createEventMutation = useMutation({
    mutationFn: (data: typeof formData) =>
      apiFetch('/events', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events-upcoming'] });
      queryClient.invalidateQueries({ queryKey: ['events-past'] });
      setShowAddModal(false);
      resetForm();
    },
    onError: (err: any) => {
      setFormError(err.message || 'Failed to publish event');
    },
  });

  // Delete Event Mutation
  const deleteEventMutation = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/events/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events-upcoming'] });
      queryClient.invalidateQueries({ queryKey: ['events-past'] });
      setSelectedEvent(null);
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to delete event');
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      bannerImageUrl: '',
      category: 'HACKATHON',
      organizer: '',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      registrationDeadline: '',
      maximumParticipants: '',
      registrationLink: '',
    });
    setFormError('');
  };

  // Image Upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setFormError('');

    const bodyFormData = new FormData();
    bodyFormData.append('banner', file);

    try {
      // Call backend directly on port 5000 bypassing the Next.js rewrite proxy
      // which corrupts multipart/form-data body request streams.
      const directUrl = `http://localhost:5000/api/v1/events/upload`;
      const token = getAccessToken() || '';

      const response = await fetch(directUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: bodyFormData,
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `HTTP error! Status: ${response.status}`);
      }

      const res = await response.json();
      setFormData((prev) => ({ ...prev, bannerImageUrl: res.bannerImageUrl }));
    } catch (err: any) {
      setFormError(err.message || 'Banner upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bannerImageUrl) {
      setFormError('Please upload a banner image first');
      return;
    }
    createEventMutation.mutate(formData);
  };

  const isEventManager = user?.role === 'PLACEMENT_COORDINATOR';
  const currentEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  // Client filtering
  const filteredEvents = currentEvents.filter((ev) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      (selectedCategory === 'Technical Event' && ev.category === 'TECHNICAL_EVENT') ||
      (selectedCategory === 'Coding Contest' && ev.category === 'CODING_CONTEST') ||
      ev.category === selectedCategory.toUpperCase();

    const matchesSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const formatCategoryName = (cat: string) => {
    if (cat === 'TECHNICAL_EVENT') return 'Technical Event';
    if (cat === 'CODING_CONTEST') return 'Coding Contest';
    return cat.charAt(0) + cat.slice(1).toLowerCase();
  };

  const formatEventDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-accent-coral via-orange-500 to-orange-400 border border-accent-coral/20 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-coral/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              Events Hub
            </h1>
            <p className="text-white text-sm max-w-xl font-light">
              Discover and participate in upcoming Hackathons, Workshops, Technical Events, and Coding Contests.
            </p>
          </div>
          {isEventManager && (
            <button
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
              className="px-5 py-3 bg-accent-coral hover:bg-accent-coral active:bg-orange-600 text-foreground rounded-xl text-sm font-semibold transition-all flex items-center gap-2 self-start md:self-auto shadow-lg shadow-accent-coral/20"
            >
              <Plus className="w-4 h-4" /> Publish Event
            </button>
          )}
        </div>
      </div>

      {/* Tabs and Filters Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-surface border border-border p-4 rounded-2xl">
        {/* Upcoming vs Past tabs */}
        <div className="flex gap-2 p-1 bg-surface rounded-xl self-start">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'upcoming' ? 'bg-accent-coral text-foreground shadow' : 'text-text-muted hover:text-foreground'
              }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'past' ? 'bg-accent-coral text-foreground shadow' : 'text-text-muted hover:text-foreground'
              }`}
          >
            Past Announcements
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search bar */}
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-xl text-foreground text-xs focus:outline-none focus:border-accent-coral/50"
            />
          </div>

          {/* Category Filter list */}
          <div className="flex gap-1.5 overflow-x-auto max-w-full pb-1 md:pb-0">
            {['All', 'Hackathon', 'Workshop', 'Technical Event', 'Coding Contest'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${selectedCategory === cat
                    ? 'bg-accent-coral/10 border-accent-coral/30 text-indigo-300'
                    : 'bg-transparent border-border text-text-muted hover:text-foreground hover:border-border'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Grid list */}
      {isLoadingUpcoming || isLoadingPast ? (
        <div className="p-12 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent-coral"></div>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="p-16 rounded-3xl bg-surface border-2 border-dashed border-border text-center space-y-4">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-semibold text-lg text-foreground">No announcements found</h3>
            <p className="text-xs text-text-muted font-light max-w-sm mx-auto">
              We couldn't find any {activeTab} announcements matching your criteria. Check back later or adjust filters.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((ev) => (
            <div
              key={ev.id}
              onClick={() => setSelectedEvent(ev)}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-background border border-border hover:border-white/15 hover:bg-slate-850 transition-all flex flex-col justify-between"
            >
              {/* Event card header banner image */}
              <div className="aspect-video w-full overflow-hidden bg-surface relative">
                {ev.bannerImageUrl ? (
                  <img
                    src={ev.bannerImageUrl}
                    alt={ev.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
                <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-background/90 text-accent-coral border border-border">
                  {formatCategoryName(ev.category)}
                </span>
              </div>

              {/* Event card content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] text-indigo-300/80 font-semibold uppercase tracking-wider block">
                    {ev.organizer}
                  </span>
                  <h3 className="text-base font-bold text-foreground leading-snug group-hover:text-accent-coral transition-colors line-clamp-2">
                    {ev.title}
                  </h3>
                </div>

                <div className="space-y-2 pt-2 border-t border-border text-xs text-text-muted">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-text-muted shrink-0" />
                    <span>{formatEventDate(ev.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-text-muted shrink-0" />
                    <span>
                      {ev.startTime} - {ev.endTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-text-muted shrink-0" />
                    <span className="truncate">{ev.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EVENT DETAILS VIEW MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-background border border-border rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative my-8">
            {/* Banner Image */}
            <div className="aspect-video w-full relative bg-background">
              <img
                src={selectedEvent.bannerImageUrl}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 p-2 bg-black/60 rounded-full hover:bg-black/80 text-text-muted hover:text-foreground transition-all cursor-pointer"
              >
                <span className="text-xs px-1 font-semibold">Close</span>
              </button>
              <span className="absolute bottom-4 left-4 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-background/90 text-accent-coral border border-border">
                {formatCategoryName(selectedEvent.category)}
              </span>
            </div>

            {/* Info details body */}
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1.5">
                  <span className="text-xs text-accent-coral font-semibold uppercase tracking-wider">
                    {selectedEvent.organizer}
                  </span>
                  <h2 className="text-2xl font-extrabold text-foreground leading-tight">
                    {selectedEvent.title}
                  </h2>
                </div>
                {(isEventManager || selectedEvent.createdBy === user?.id) && (
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this event announcement?')) {
                        deleteEventMutation.mutate(selectedEvent.id);
                      }
                    }}
                    className="p-2 text-text-muted hover:text-rose-400 hover:bg-surface rounded-xl transition-all cursor-pointer shrink-0"
                    title="Delete announcement"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Event parameters metadata cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-surface p-4 rounded-2xl text-xs">
                <div>
                  <span className="text-text-muted font-medium">Date</span>
                  <p className="font-semibold text-foreground mt-1">{formatEventDate(selectedEvent.date)}</p>
                </div>
                <div>
                  <span className="text-text-muted font-medium">Timings</span>
                  <p className="font-semibold text-foreground mt-1">
                    {selectedEvent.startTime} - {selectedEvent.endTime}
                  </p>
                </div>
                <div>
                  <span className="text-text-muted font-medium">Venue / Location</span>
                  <p className="font-semibold text-foreground mt-1 truncate" title={selectedEvent.location}>
                    {selectedEvent.location}
                  </p>
                </div>
                <div>
                  <span className="text-text-muted font-medium">Max Limit</span>
                  <p className="font-semibold text-foreground mt-1">
                    {selectedEvent.maximumParticipants ? `${selectedEvent.maximumParticipants} seats` : 'Open'}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">About Event</h4>
                <p className="text-sm text-text-muted font-light leading-relaxed whitespace-pre-wrap">
                  {selectedEvent.description}
                </p>
              </div>

              {/* Deadline & Register Button footer row */}
              <div className="border-t border-border pt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="text-xs text-text-muted text-center sm:text-left">
                  <span>Registration Deadline: </span>
                  <span className="text-rose-400 font-semibold">{formatEventDate(selectedEvent.registrationDeadline)}</span>
                </div>
                <a
                  href={selectedEvent.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-accent-coral hover:bg-accent-coral active:bg-orange-600 text-foreground rounded-xl text-sm font-semibold transition-all flex items-center gap-2 shadow-lg shadow-accent-coral/20 w-full sm:w-auto justify-center"
                >
                  Register for Event <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE EVENT ANNOUNCEMENT FORM MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-background border border-border p-6 md:p-8 rounded-3xl max-w-xl w-full space-y-6 my-8">
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-foreground">Publish Event Announcement</h3>
              <p className="text-xs text-text-muted font-light">
                Fill in the details below to broadcast a college event.
              </p>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {/* Image upload field */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-muted">Banner Image (Required)</label>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="hidden"
                      id="event-banner-upload-input"
                    />
                    <label
                      htmlFor="event-banner-upload-input"
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-surface border border-dashed border-white/15 hover:border-accent-coral/50 rounded-xl text-text-muted text-xs font-medium cursor-pointer transition-all"
                    >
                      <ImageIcon className="w-4 h-4 text-text-muted" />
                      {isUploading ? 'Uploading...' : 'Choose Image File'}
                    </label>
                  </div>
                  {formData.bannerImageUrl && (
                    <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 border border-border bg-surface">
                      <img src={formData.bannerImageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* Title & Category row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-muted">Event Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Campus Hackathon 2026"
                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground text-xs focus:outline-none focus:border-accent-coral/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-muted">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground text-xs focus:outline-none focus:border-accent-coral/50"
                  >
                    <option value="HACKATHON">Hackathon</option>
                    <option value="WORKSHOP">Workshop</option>
                    <option value="TECHNICAL_EVENT">Technical Event</option>
                    <option value="CODING_CONTEST">Coding Contest</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-muted">Event Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Explain details of the event announcement..."
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground text-xs focus:outline-none focus:border-accent-coral/50"
                />
              </div>

              {/* Organizer & Location row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-muted">Organizer Name</label>
                  <input
                    type="text"
                    required
                    value={formData.organizer}
                    onChange={(e) => setFormData((prev) => ({ ...prev, organizer: e.target.value }))}
                    placeholder="e.g. Google Developer Student Club"
                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground text-xs focus:outline-none focus:border-accent-coral/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-muted">Location / Venue</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g. Seminar Hall A, or Online"
                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground text-xs focus:outline-none focus:border-accent-coral/50"
                  />
                </div>
              </div>

              {/* Date & Timings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-muted">Scheduled Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground text-xs focus:outline-none focus:border-accent-coral/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-muted">Start Time</label>
                  <input
                    type="text"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
                    placeholder="e.g. 09:00 AM"
                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground text-xs focus:outline-none focus:border-accent-coral/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-muted">End Time</label>
                  <input
                    type="text"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
                    placeholder="e.g. 05:00 PM"
                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground text-xs focus:outline-none focus:border-accent-coral/50"
                  />
                </div>
              </div>

              {/* Deadline & Max seats & Registration URL */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-muted">Deadline Date</label>
                  <input
                    type="date"
                    required
                    value={formData.registrationDeadline}
                    onChange={(e) => setFormData((prev) => ({ ...prev, registrationDeadline: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground text-xs focus:outline-none focus:border-accent-coral/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-muted">Maximum Limit</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.maximumParticipants}
                    onChange={(e) => setFormData((prev) => ({ ...prev, maximumParticipants: e.target.value }))}
                    placeholder="e.g. 100"
                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground text-xs focus:outline-none focus:border-accent-coral/50"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-xs font-semibold text-text-muted">Reg. Link URL</label>
                  <input
                    type="url"
                    required
                    value={formData.registrationLink}
                    onChange={(e) => setFormData((prev) => ({ ...prev, registrationLink: e.target.value }))}
                    placeholder="https://..."
                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground text-xs focus:outline-none focus:border-accent-coral/50"
                  />
                </div>
              </div>

              {formError && <p className="text-xs text-rose-450">{formError}</p>}

              <div className="flex gap-3 justify-end pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 text-xs text-text-muted hover:text-foreground transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createEventMutation.isPending || isUploading}
                  className="px-5 py-2.5 bg-accent-coral hover:bg-accent-coral disabled:opacity-50 text-foreground rounded-xl text-xs font-semibold transition-all cursor-pointer"
                >
                  {createEventMutation.isPending ? 'Publishing...' : 'Publish Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
