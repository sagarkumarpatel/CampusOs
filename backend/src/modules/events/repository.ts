import prisma from '../../config/prisma';
import { EventCategory } from '@prisma/client';

export class EventsRepository {
  async getEvents() {
    return prisma.event.findMany({
      orderBy: { date: 'asc' },
    });
  }

  async getUpcomingEvents() {
    return prisma.event.findMany({
      where: {
        date: {
          gte: new Date(),
        },
      },
      orderBy: { date: 'asc' },
    });
  }

  async getPastEvents() {
    return prisma.event.findMany({
      where: {
        date: {
          lt: new Date(),
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async findEventById(id: string) {
    return prisma.event.findUnique({
      where: { id },
    });
  }

  async createEvent(createdBy: string, data: any) {
    return prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        bannerImageUrl: data.bannerImageUrl,
        category: data.category as EventCategory,
        organizer: data.organizer,
        date: new Date(data.date),
        startTime: data.startTime,
        endTime: data.endTime,
        location: data.location,
        registrationDeadline: new Date(data.registrationDeadline),
        maximumParticipants: data.maximumParticipants,
        registrationLink: data.registrationLink,
        createdBy,
      },
    });
  }

  async deleteEvent(id: string) {
    return prisma.event.delete({
      where: { id },
    });
  }
}
