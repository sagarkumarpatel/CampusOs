import prisma from '../../config/prisma';
import { RequestStatus } from '@prisma/client';

export class MentorshipRepository {
  async getMentors() {
    return prisma.mentorProfile.findMany({
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMentorProfile(userId: string) {
    return prisma.mentorProfile.findUnique({
      where: { userId },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async upsertMentorProfile(userId: string, data: any) {
    return prisma.mentorProfile.upsert({
      where: { userId },
      update: {
        title: data.title,
        company: data.company,
        skills: data.skills,
        bio: data.bio || null,
        linkedinUrl: data.linkedinUrl || null,
        calendlyUrl: data.calendlyUrl || null,
        isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
      },
      create: {
        userId,
        title: data.title,
        company: data.company,
        skills: data.skills,
        bio: data.bio || null,
        linkedinUrl: data.linkedinUrl || null,
        calendlyUrl: data.calendlyUrl || null,
        isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
      },
    });
  }

  async findExistingPendingRequest(studentId: string, mentorId: string) {
    return prisma.mentorshipRequest.findFirst({
      where: {
        studentId,
        mentorId,
        status: RequestStatus.PENDING,
      },
    });
  }

  async createRequest(studentId: string, mentorId: string, message: string) {
    return prisma.mentorshipRequest.create({
      data: {
        studentId,
        mentorId,
        message,
        status: RequestStatus.PENDING,
      },
    });
  }

  async getRequestById(id: string) {
    return prisma.mentorshipRequest.findUnique({
      where: { id },
      include: {
        mentor: true,
      },
    });
  }

  async updateRequestStatus(id: string, status: RequestStatus) {
    return prisma.mentorshipRequest.update({
      where: { id },
      data: { status },
    });
  }

  async getStudentRequests(studentId: string) {
    return prisma.mentorshipRequest.findMany({
      where: { studentId },
      include: {
        mentor: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMentorRequests(mentorUserId: string) {
    // Find the mentor's profile first
    const mentorProfile = await prisma.mentorProfile.findUnique({
      where: { userId: mentorUserId },
    });

    if (!mentorProfile) {
      return [];
    }

    return prisma.mentorshipRequest.findMany({
      where: { mentorId: mentorProfile.id },
      include: {
        student: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
