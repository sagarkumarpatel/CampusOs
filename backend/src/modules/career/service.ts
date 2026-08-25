import { CareerRepository } from './repository';
import { CreateOpportunityInput, UpdateOpportunityInput } from './types';
import { createOpportunitySchema, updateOpportunitySchema } from './schema';

export class CareerService {
  private repository = new CareerRepository();

  async getOpportunities(userId: string) {
    return this.repository.getOpportunities(userId);
  }

  async createOpportunity(input: CreateOpportunityInput, createdById: string) {
    const validated = createOpportunitySchema.parse(input);
    return this.repository.createOpportunity(validated, createdById);
  }

  async updateOpportunity(id: string, input: UpdateOpportunityInput) {
    const validated = updateOpportunitySchema.parse(input);
    
    const existing = await this.repository.getOpportunityById(id, '');
    if (!existing) {
      throw new Error('Opportunity not found');
    }

    return this.repository.updateOpportunity(id, validated);
  }

  async deleteOpportunity(id: string) {
    const existing = await this.repository.getOpportunityById(id, '');
    if (!existing) {
      throw new Error('Opportunity not found');
    }

    return this.repository.deleteOpportunity(id);
  }

  async registerOpportunity(opportunityId: string, userId: string, email: string) {
    const opportunity = await this.repository.getOpportunityById(opportunityId, userId);
    if (!opportunity) {
      throw new Error('Opportunity not found');
    }

    if (opportunity.hasRegistered) {
      // User is already registered, return existing or succeed silently
      return { message: 'Already registered' };
    }

    return this.repository.register(opportunityId, userId, email);
  }

  async unregisterOpportunity(opportunityId: string, userId: string) {
    const opportunity = await this.repository.getOpportunityById(opportunityId, userId);
    if (!opportunity) {
      throw new Error('Opportunity not found');
    }

    if (!opportunity.hasRegistered) {
      return { message: 'Not registered' };
    }

    await this.repository.unregister(opportunityId, userId);
    return { message: 'Unregistered successfully' };
  }

  async downloadRegisteredEmails(opportunityId: string) {
    const opportunity = await this.repository.getOpportunityById(opportunityId, '');
    if (!opportunity) {
      throw new Error('Opportunity not found');
    }

    const registrations = await this.repository.getRegisteredStudents(opportunityId);
    
    // Generate CSV string
    let csvContent = 'Email\n';
    registrations.forEach((reg: { email: string }) => {
      csvContent += `${reg.email}\n`;
    });

    const filename = `${opportunity.companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${opportunity.role.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-registered-students.csv`;

    return {
      csvContent,
      filename,
    };
  }
}
