'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../../lib/api';
import { useAuth } from '../../providers/AuthProvider';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import {
  CheckCircle2,
  Calendar,
  Users,
  FileText,
  Briefcase,
  ArrowUpRight,
} from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: dsaStats, isLoading: isDsaLoading } = useQuery({
    queryKey: ['dsa-dashboard-stats'],
    queryFn: () => apiFetch('/dsa/dashboard'),
    enabled: !!user,
  });

  const { data: mentorshipRequests, isLoading: isMentorshipLoading } = useQuery({
    queryKey: ['mentors-requests'],
    queryFn: () => apiFetch('/mentors/requests'),
    enabled: !!user,
  });

  const { data: upcomingEvents, isLoading: isEventsLoading } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: () => apiFetch('/events/upcoming'),
    enabled: !!user,
  });

  const { data: resourcesData, isLoading: isResourcesLoading } = useQuery({
    queryKey: ['resources-data'],
    queryFn: () => apiFetch('/resources'),
    enabled: !!user,
  });

  const { data: careerOpportunities, isLoading: isCareerLoading } = useQuery({
    queryKey: ['career-opportunities'],
    queryFn: () => apiFetch('/career'),
    enabled: !!user,
  });

  const activeMentorRequest = mentorshipRequests?.sent?.find((r: any) => r.status === 'ACCEPTED');
  const nextEvent = upcomingEvents?.[0];
  const savedResourcesCount = (resourcesData?.subjectNotes?.length || 0) +
    (resourcesData?.previousYearQuestions?.length || 0) +
    (resourcesData?.interviewNotes?.length || 0) +
    (resourcesData?.cheatSheets?.length || 0);
  const latestResource = resourcesData?.cheatSheets?.[0] || resourcesData?.subjectNotes?.[0];
  const latestApplication = careerOpportunities?.[0];

  const isLoading = isDsaLoading || isMentorshipLoading || isEventsLoading || isResourcesLoading || isCareerLoading;

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Welcome Banner */}
      <motion.div variants={itemVariants} className="p-8 rounded-3xl bg-gradient-to-r from-accent-coral to-orange-500 border border-accent-coral/20 relative overflow-hidden shadow-2xl shadow-accent-coral/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl mix-blend-overlay" />
        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Welcome back, {user?.profile?.firstName || 'Sagar'}!
          </h1>
          <p className="text-white/90 text-sm md:text-base max-w-2xl font-light">
            You are making great progress in your growth journey. Track preparation goals, find matching mentors, and log internship applications.
          </p>
        </div>
      </motion.div>

      {/* Modules Dashboard Overview */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Module 1: Placement Preparation Progress */}
        <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-surface border border-border hover:border-accent-coral/50 hover:shadow-xl hover:shadow-accent-coral/10 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between cursor-pointer">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="p-3 bg-accent-coral/10 rounded-xl text-accent-coral group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-5 h-5" />
              </span>
              <Link href="/dashboard/placement" className="text-text-muted hover:text-foreground flex items-center gap-1 text-xs font-medium">
                View Prep <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <h3 className="font-semibold text-lg mb-1 text-foreground">Placement Preparation</h3>
            <p className="text-xs text-text-muted mb-6">Track your DSA and Computer Science syllabus</p>
          </div>
        </motion.div>

        {/* Module 2: Mentor Guidance Summary */}
        <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-surface border border-border hover:border-accent-coral/50 hover:shadow-xl hover:shadow-accent-coral/10 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between cursor-pointer">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="p-3 bg-accent-coral/10 rounded-xl text-accent-coral group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </span>
              <Link href="/dashboard/mentorship" className="text-text-muted hover:text-foreground flex items-center gap-1 text-xs font-medium">
                Find Mentor <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <h3 className="font-semibold text-lg mb-1 text-foreground">My Mentor</h3>
            <p className="text-xs text-text-muted mb-4">Connecting with senior guidance</p>

            {activeMentorRequest ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-background border border-border">
                <div className="w-9 h-9 rounded-full bg-accent-coral flex items-center justify-center font-bold text-sm text-white">
                  {activeMentorRequest.mentorName?.charAt(0) || 'M'}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-foreground">{activeMentorRequest.mentorName}</h4>
                  <p className="text-[10px] text-text-muted">{activeMentorRequest.mentorTitle} @ {activeMentorRequest.mentorCompany}</p>
                </div>
              </div>
            ) : (
              <div className="text-xs text-text-muted p-3 rounded-xl bg-background border border-border text-center">
                No mentor selected yet.
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-between items-center text-xs h-6">
            {activeMentorRequest && (
              <span className="text-[10px] text-accent-coral font-medium px-2 py-0.5 rounded bg-accent-coral/15">Active Session</span>
            )}
          </div>
        </motion.div>

        {/* Module 3: Events hub */}
        <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-surface border border-border hover:border-accent-coral/50 hover:shadow-xl hover:shadow-accent-coral/10 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between cursor-pointer">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="p-3 bg-accent-coral/10 rounded-xl text-accent-coral group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5" />
              </span>
              <Link href="/dashboard/events" className="text-text-muted hover:text-foreground flex items-center gap-1 text-xs font-medium">
                All Events <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <h3 className="font-semibold text-lg mb-1 text-foreground">Upcoming Events</h3>
            <p className="text-xs text-text-muted mb-4">Hackathons, contests & seminars</p>

            <div className="space-y-2">
              {nextEvent ? (
                <div className="p-2 rounded-lg bg-background border border-border flex justify-between items-center">
                  <span className="text-xs font-medium text-foreground truncate">{nextEvent.title}</span>
                  <span className="text-[10px] text-text-muted shrink-0 ml-2">
                    {new Date(nextEvent.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ) : (
                <div className="p-2 rounded-lg bg-background border border-border text-center text-xs text-text-muted">
                  No upcoming events
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 text-xs text-text-muted">
            Available events: <span className="text-accent-coral font-semibold">{upcomingEvents?.length || 0}</span>
          </div>
        </motion.div>

        {/* Module 4: Saved Notes */}
        <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-surface border border-border hover:border-accent-coral/50 hover:shadow-xl hover:shadow-accent-coral/10 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between cursor-pointer">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="p-3 bg-accent-coral/10 rounded-xl text-accent-coral group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </span>
              <Link href="/dashboard/resources" className="text-text-muted hover:text-foreground flex items-center gap-1 text-xs font-medium">
                Resources <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <h3 className="font-semibold text-lg mb-1 text-foreground">Academic Resources</h3>
            <p className="text-xs text-text-muted mb-4">Saved lecture notes & roadmaps</p>

            <div className="space-y-2">
              {latestResource ? (
                <div className="p-2 rounded-lg bg-background border border-border flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-accent-coral shrink-0" />
                  <span className="text-xs text-foreground truncate">{latestResource.title}</span>
                </div>
              ) : (
                <div className="p-2 rounded-lg bg-background border border-border text-center text-xs text-text-muted">
                  No resources available
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 text-xs text-text-muted">
            Total resources: <span className="text-foreground font-semibold">{savedResourcesCount}</span>
          </div>
        </motion.div>

        {/* Module 5: Career Applications */}
        <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-surface border border-border hover:border-accent-coral/50 hover:shadow-xl hover:shadow-accent-coral/10 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between cursor-pointer">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="p-3 bg-accent-coral/10 rounded-xl text-accent-coral group-hover:scale-110 transition-transform">
                <Briefcase className="w-5 h-5" />
              </span>
              <Link href="/dashboard/career" className="text-text-muted hover:text-foreground flex items-center gap-1 text-xs font-medium">
                Applications <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <h3 className="font-semibold text-lg mb-1 text-foreground">Career Tracking</h3>
            <p className="text-xs text-text-muted mb-4">Application pipeline timeline</p>

            {latestApplication ? (
              <div className="p-3 rounded-xl bg-background border border-border">
                <div className="flex justify-between text-xs font-semibold mb-1 text-foreground">
                  <span className="truncate mr-2">{latestApplication.companyName}</span>
                  <span className="text-accent-coral shrink-0">{latestApplication.jobType?.replace(/_/g, ' ')}</span>
                </div>
                <p className="text-[10px] text-text-muted truncate">{latestApplication.role}</p>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-background border border-border text-center text-xs text-text-muted">
                No active opportunities
              </div>
            )}
          </div>
          <div className="mt-4 text-xs text-text-muted">
            Total active logs: <span className="text-foreground font-semibold">{careerOpportunities?.length || 0}</span>
          </div>
        </motion.div>

      </motion.div>
    </motion.div>
  );
}
