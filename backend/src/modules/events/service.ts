import { EventsRepository } from './repository';

const repository = new EventsRepository();

export class EventsService {
  async getEvents() {
    return repository.getEvents();
  }

  async getUpcomingEvents() {
    return repository.getUpcomingEvents();
  }

  async getPastEvents() {
    return repository.getPastEvents();
  }

  async getEventById(id: string) {
    const event = await repository.findEventById(id);
    if (!event) {
      throw new Error('Event not found');
    }
    return event;
  }

  async createEvent(createdBy: string, data: any) {
    // Validate that End Time makes sense relative to start times or any other date bounds
    // (End Time must occur after Start Time is verified in validation schema / service)
    const eventDate = new Date(data.date);
    const deadlineDate = new Date(data.registrationDeadline);
    
    // We can also perform custom validations here if needed
    return repository.createEvent(createdBy, data);
  }

  async deleteEvent(id: string, userId: string, roles: string[]) {
    const event = await repository.findEventById(id);
    if (!event) {
      throw new Error('Event not found');
    }
    
    if (!roles.includes('PLACEMENT_COORDINATOR') && event.createdBy !== userId) {
      throw new Error('Forbidden: Only Placement Coordinators can delete events');
    }

    return repository.deleteEvent(id);
  }
}
