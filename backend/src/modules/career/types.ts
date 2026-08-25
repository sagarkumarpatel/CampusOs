export type OpportunityType = 'INTERNSHIP' | 'FULL_TIME_JOB' | 'FREELANCE_OPPORTUNITY';

export interface CreateOpportunityInput {
  companyName: string;
  role: string;
  jobType: OpportunityType;
  location: string;
  stipendPerMonth: number;
  applicationLink: string;
  bannerImageUrl: string;
}

export interface UpdateOpportunityInput {
  companyName?: string;
  role?: string;
  jobType?: OpportunityType;
  location?: string;
  stipendPerMonth?: number;
  applicationLink?: string;
  bannerImageUrl?: string;
}
