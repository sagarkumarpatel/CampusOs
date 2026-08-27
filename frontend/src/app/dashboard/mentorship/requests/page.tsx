'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../../../../lib/api';
import { useAuth } from '../../../../providers/AuthProvider';
import { CheckCircle2, XCircle, Clock, Calendar, RefreshCw, ArrowLeft, UserCheck, Ban } from 'lucide-react';
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

type RequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';

interface SentRequest {
  id: string;
  message: string;
  status: RequestStatus;
  createdAt: string;
  mentorName: string;
  mentorTitle: string;
  mentorCompany: string;
  calendlyUrl: string | null;
  linkedinUrl: string | null;
}

interface ReceivedRequest {
  id: string;
  message: string;
  status: RequestStatus;
  createdAt: string;
  studentName: string;
  studentBio: string | null;
  studentSkills: string[];
}

interface RequestLists {
  sent: SentRequest[];
  received: ReceivedRequest[];
}

export default function MentorshipRequestsPage() {
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery<RequestLists>({
    queryKey: ['mentors-requests'],
    queryFn: () => apiFetch('/mentors/requests'),
    enabled: !loading && !!user,
  });

  const mutation = useMutation({
    mutationFn: ({ requestId, status }: { requestId: string; status: 'ACCEPTED' | 'REJECTED' | 'CANCELLED' }) =>
      apiFetch(`/mentors/requests/${requestId}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentors-requests'] });
    },
  });

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent-coral"></div>
      </div>
    );
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto overflow-y-auto">
      {/* Back nav */}
      <Link
        href="/dashboard/mentorship"
        className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Mentor Directory
      </Link>

      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">My Mentorship Requests</h1>
        <p className="text-text-muted text-sm mt-1">Track the status of requests you've sent and received.</p>
      </div>

      {/* ─── RECEIVED (Mentor view) ─── */}
      {user?.role === 'MENTOR' && (
        <section className="space-y-4">
          <div className="flex items-center gap-3 border-b border-border pb-3">
            <UserCheck className="w-5 h-5 text-accent-coral" />
            <h2 className="text-lg font-bold text-foreground">Incoming Requests</h2>
            {requests?.received?.filter(r => r.status === 'PENDING').length ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {requests.received.filter(r => r.status === 'PENDING').length} pending
              </span>
            ) : null}
          </div>

          {requests?.received?.length === 0 ? (
            <p className="text-text-muted text-sm py-4">No one has sent you a mentorship request yet.</p>
          ) : (
            <div className="space-y-4">
              {requests?.received?.map((req) => (
                <div key={req.id} className="rounded-2xl bg-surface border border-border overflow-hidden">
                  {/* Student info */}
                  <div className="p-5 flex flex-col md:flex-row justify-between gap-5">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-base font-bold text-foreground">{req.studentName}</h3>
                        {req.status === 'PENDING' && (
                          <span className="inline-flex items-center gap-1 text-[11px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20">
                            <Clock className="w-2.5 h-2.5" /> Awaiting your response
                          </span>
                        )}
                        {req.status === 'ACCEPTED' && (
                          <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Accepted
                          </span>
                        )}
                        {req.status === 'REJECTED' && (
                          <span className="inline-flex items-center gap-1 text-[11px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded-full border border-rose-500/20">
                            <XCircle className="w-2.5 h-2.5" /> Declined
                          </span>
                        )}
                      </div>

                      {req.studentBio && (
                        <p className="text-xs text-text-muted line-clamp-2">{req.studentBio}</p>
                      )}

                      {req.studentSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {req.studentSkills.slice(0, 5).map((s) => (
                            <span key={s} className="px-2 py-0.5 rounded text-[10px] bg-surface border border-white/8 text-text-muted">{s}</span>
                          ))}
                        </div>
                      )}

                      {/* Their message */}
                      <div className="bg-black/30 border border-border p-4 rounded-xl">
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5">Their message</p>
                        <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{req.message}</p>
                      </div>

                      <p className="text-[10px] text-slate-600">Received on {formatDate(req.createdAt)}</p>
                    </div>

                    {/* Action buttons */}
                    {req.status === 'PENDING' && (
                      <div className="flex md:flex-col gap-2 items-start shrink-0">
                        <button
                          onClick={() => mutation.mutate({ requestId: req.id, status: 'ACCEPTED' })}
                          disabled={mutation.isPending}
                          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-foreground text-xs font-bold transition-all disabled:opacity-50"
                        >
                          {mutation.isPending && mutation.variables?.requestId === req.id && mutation.variables?.status === 'ACCEPTED' ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          )}
                          Accept
                        </button>
                        <button
                          onClick={() => mutation.mutate({ requestId: req.id, status: 'REJECTED' })}
                          disabled={mutation.isPending}
                          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-surface hover:bg-rose-600 hover:text-foreground border border-border text-text-muted text-xs font-bold transition-all disabled:opacity-50"
                        >
                          {mutation.isPending && mutation.variables?.requestId === req.id && mutation.variables?.status === 'REJECTED' ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5" />
                          )}
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ─── SENT (Student view) ─── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 border-b border-border pb-3">
          <Calendar className="w-5 h-5 text-accent-coral" />
          <h2 className="text-lg font-bold text-foreground">Requests I Sent</h2>
        </div>

        {requests?.sent?.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <p className="text-text-muted text-sm">You haven't sent any mentorship requests yet.</p>
            <Link href="/dashboard/mentorship" className="inline-flex items-center gap-1.5 text-xs text-accent-coral hover:text-violet-300 font-semibold transition-colors">
              Browse Mentors →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {requests?.sent?.map((req) => {
              const isAccepted = req.status === 'ACCEPTED';
              const isRejected = req.status === 'REJECTED';
              const isPending = req.status === 'PENDING';

              return (
                <div
                  key={req.id}
                  className={`rounded-2xl border overflow-hidden transition-all ${
                    isAccepted ? 'bg-emerald-950/20 border-emerald-500/20' :
                    isRejected ? 'bg-rose-950/10 border-rose-500/10' :
                    'bg-surface border-border'
                  }`}
                >
                  {/* ACCEPTED banner */}
                  {isAccepted && (
                    <div className="px-5 py-3 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <p className="text-sm font-bold text-emerald-300">
                        🎉 {req.mentorName} accepted your request!
                      </p>
                    </div>
                  )}

                  {/* REJECTED banner */}
                  {isRejected && (
                    <div className="px-5 py-3 bg-rose-500/5 border-b border-rose-500/10 flex items-center gap-2">
                      <Ban className="w-4 h-4 text-rose-400 shrink-0" />
                      <p className="text-sm font-bold text-rose-300">
                        {req.mentorName} declined your request
                      </p>
                    </div>
                  )}

                  <div className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-base font-bold text-foreground">{req.mentorName}</h3>
                        <p className="text-xs text-text-muted">{req.mentorTitle} @ <span className="font-semibold text-accent-coral">{req.mentorCompany}</span></p>
                        <p className="text-[10px] text-slate-600 mt-1">Sent on {formatDate(req.createdAt)}</p>
                      </div>
                      {isPending && (
                        <span className="inline-flex items-center gap-1 text-[11px] bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full border border-amber-500/20 shrink-0">
                          <Clock className="w-2.5 h-2.5" /> Waiting for reply
                        </span>
                      )}
                    </div>

                    {/* Their message */}
                    <div className="bg-black/20 border border-border p-4 rounded-xl">
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5">Your message</p>
                      <p className="text-sm text-text-muted leading-relaxed whitespace-pre-wrap">{req.message}</p>
                    </div>

                    {/* ACCEPTED: next step section */}
                    {isAccepted && (
                      <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-4 space-y-3">
                        <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Next Step — Connect with your mentor</p>
                        <p className="text-xs text-text-muted">
                          Your mentorship session request has been approved. Reach out to <span className="font-semibold text-foreground">{req.mentorName}</span> via LinkedIn to schedule your session.
                        </p>
                        <div className="flex flex-wrap gap-3 pt-1">
                          {req.linkedinUrl ? (
                            <a
                              href={req.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-foreground font-bold text-xs transition-all"
                            >
                              <LinkedinIcon className="w-4 h-4" />
                              Connect on LinkedIn
                            </a>
                          ) : (
                            <p className="text-xs text-text-muted italic">This mentor hasn't added a LinkedIn URL yet.</p>
                          )}
                          {req.calendlyUrl && (
                            <a
                              href={req.calendlyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-coral hover:bg-accent-coral text-foreground font-bold text-xs transition-all"
                            >
                              <Calendar className="w-4 h-4" />
                              Book a Session
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {/* REJECTED: closure message */}
                    {isRejected && (
                      <div className="rounded-xl bg-rose-500/5 border border-rose-500/10 p-4 space-y-2">
                        <p className="text-xs font-bold text-rose-400 uppercase tracking-wider">Request Declined</p>
                        <p className="text-xs text-text-muted leading-relaxed">
                          Unfortunately, <span className="font-semibold text-foreground">{req.mentorName}</span> wasn't able to take on your request at this time. Don't be discouraged — browse other mentors in the directory and send them a request.
                        </p>
                        <Link href="/dashboard/mentorship" className="inline-flex items-center gap-1.5 text-xs text-accent-coral hover:text-violet-300 font-semibold transition-colors">
                          Browse other mentors →
                        </Link>
                      </div>
                    )}

                    {/* PENDING: cancel option */}
                    {isPending && (
                      <div className="flex justify-end">
                        <button
                          onClick={() => mutation.mutate({ requestId: req.id, status: 'CANCELLED' })}
                          disabled={mutation.isPending}
                          className="text-xs text-text-muted hover:text-rose-400 transition-colors font-medium"
                        >
                          {mutation.isPending && mutation.variables?.requestId === req.id ? 'Cancelling...' : 'Cancel Request'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
