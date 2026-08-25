import prisma from '../../config/prisma';
import { CreateOpportunityInput, UpdateOpportunityInput } from './types';

interface OpportunityWithCountAndRegs {
  id: string;
  companyName: string;
  role: string;
  jobType: 'INTERNSHIP' | 'FULL_TIME_JOB' | 'FREELANCE_OPPORTUNITY';
  location: string;
  stipendPerMonth: number;
  applicationLink: string;
  bannerImageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    registrations: number;
  };
  registrations: {
    id: string;
  }[];
}

export class CareerRepository {
  async getOpportunities(userId: string) {
    const opportunities = await prisma.careerOpportunity.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { registrations: true },
        },
        registrations: {
          where: { userId },
          select: { id: true },
        },
      },
    });

    return (opportunities as unknown as OpportunityWithCountAndRegs[]).map((op) => ({
      id: op.id,
      companyName: op.companyName,
      role: op.role,
      jobType: op.jobType,
      location: op.location,
      stipendPerMonth: op.stipendPerMonth,
      applicationLink: op.applicationLink,
      bannerImageUrl: op.bannerImageUrl,
      createdAt: op.createdAt,
      updatedAt: op.updatedAt,
      registrationCount: op._count.registrations,
      hasRegistered: op.registrations.length > 0,
    }));
  }

  async getOpportunityById(id: string, userId: string) {
    const op = await prisma.careerOpportunity.findUnique({
      where: { id },
      include: {
        _count: {
          select: { registrations: true },
        },
        registrations: {
          where: { userId },
          select: { id: true },
        },
      },
    });

    if (!op) return null;

    const opTyped = op as unknown as OpportunityWithCountAndRegs;

    return {
      id: opTyped.id,
      companyName: opTyped.companyName,
      role: opTyped.role,
      jobType: opTyped.jobType,
      location: opTyped.location,
      stipendPerMonth: opTyped.stipendPerMonth,
      applicationLink: opTyped.applicationLink,
      bannerImageUrl: opTyped.bannerImageUrl,
      createdAt: opTyped.createdAt,
      updatedAt: opTyped.updatedAt,
      registrationCount: opTyped._count.registrations,
      hasRegistered: opTyped.registrations.length > 0,
    };
  }

  async createOpportunity(input: CreateOpportunityInput, createdById: string) {
    return prisma.careerOpportunity.create({
      data: {
        ...input,
        createdById,
      },
    });
  }

  async updateOpportunity(id: string, input: UpdateOpportunityInput) {
    return prisma.careerOpportunity.update({
      where: { id },
      data: input,
    });
  }

  async deleteOpportunity(id: string) {
    return prisma.careerOpportunity.delete({
      where: { id },
    });
  }

  async register(opportunityId: string, userId: string, email: string) {
    return prisma.careerRegistration.create({
      data: {
        opportunityId,
        userId,
        email,
      },
    });
  }

  async unregister(opportunityId: string, userId: string) {
    return prisma.careerRegistration.deleteMany({
      where: {
        opportunityId,
        userId,
      },
    });
  }

  async getRegisteredStudents(opportunityId: string) {
    return prisma.careerRegistration.findMany({
      where: { opportunityId },
      select: {
        email: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}
