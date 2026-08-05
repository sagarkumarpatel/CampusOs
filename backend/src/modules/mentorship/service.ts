import { MentorshipRepository } from './repository';
import { RequestStatus } from '@prisma/client';

const repository = new MentorshipRepository();

export class MentorshipService {
  async getMentorsList(userId: string) {
    const mentors = await repository.getMentors();
    
    return mentors
      .map((m) => ({
        id: m.id,
        userId: m.userId,
        title: m.title,
        company: m.company,
        skills: m.skills,
        bio: m.bio,
        linkedinUrl: m.linkedinUrl,
        calendlyUrl: m.calendlyUrl,
        name: m.user?.profile 
          ? `${m.user.profile.firstName} ${m.user.profile.lastName}`
          : 'Anonymous Mentor',
        avatarUrl: m.user?.profile?.avatarUrl || null,
      }));
  }

  async setupMentorProfile(userId: string, data: any) {
    return repository.upsertMentorProfile(userId, data);
  }

  async getOwnMentorProfile(userId: string) {
    const profile = await repository.getMentorProfile(userId);
    if (!profile) return null;

    return {
      id: profile.id,
      title: profile.title,
      company: profile.company,
      skills: profile.skills,
      bio: profile.bio,
      linkedinUrl: profile.linkedinUrl,
      calendlyUrl: profile.calendlyUrl,
      isAvailable: profile.isAvailable,
    };
  }

  async sendMentorshipRequest(studentId: string, mentorId: string, message: string) {
    // 1. Verify mentor profile exists
    const mentorProfile = await prisma.mentorProfile.findUnique({
      where: { id: mentorId },
    });

    if (!mentorProfile) {
      throw new Error('Mentor profile not found');
    }

    // 2. Prevent self-mentorship
    if (mentorProfile.userId === studentId) {
      throw new Error('You cannot request mentorship from yourself');
    }

    // 3. Prevent duplicate active requests
    const existing = await repository.findExistingPendingRequest(studentId, mentorId);
    if (existing) {
      throw new Error('You already have a pending request for this mentor');
    }

    return repository.createRequest(studentId, mentorId, message);
  }

  async handleRequestStatus(userId: string, requestId: string, status: RequestStatus) {
    const request = await repository.getRequestById(requestId);
    if (!request) {
      throw new Error('Request not found');
    }

    if (status === RequestStatus.ACCEPTED || status === RequestStatus.REJECTED) {
      // Must be the mentor resolving the request
      if (request.mentor.userId !== userId) {
        throw new Error('Unauthorized to resolve this request');
      }
    } else if (status === RequestStatus.CANCELLED) {
      // Must be the student cancelling the request
      if (request.studentId !== userId) {
        throw new Error('Unauthorized to cancel this request');
      }
    }

    return repository.updateRequestStatus(requestId, status);
  }

  async getUserRequests(userId: string) {
    const sent = await repository.getStudentRequests(userId);
    const received = await repository.getMentorRequests(userId);

    const formattedSent = sent.map((req) => ({
      id: req.id,
      message: req.message,
      status: req.status,
      createdAt: req.createdAt,
      mentorName: req.mentor.user?.profile 
        ? `${req.mentor.user.profile.firstName} ${req.mentor.user.profile.lastName}`
        : 'Anonymous Mentor',
      mentorTitle: req.mentor.title,
      mentorCompany: req.mentor.company,
      calendlyUrl: req.status === RequestStatus.ACCEPTED ? req.mentor.calendlyUrl : null,
      linkedinUrl: req.status === RequestStatus.ACCEPTED ? req.mentor.linkedinUrl : null,
    }));

    const formattedReceived = received.map((req) => ({
      id: req.id,
      message: req.message,
      status: req.status,
      createdAt: req.createdAt,
      studentName: req.student?.profile
        ? `${req.student.profile.firstName} ${req.student.profile.lastName}`
        : 'Anonymous Student',
      studentBio: req.student?.profile?.bio || null,
      studentSkills: req.student?.profile?.skills || [],
    }));

    return {
      sent: formattedSent,
      received: formattedReceived,
    };
  }
}

import prisma from '../../config/prisma';
