export interface ReviewScore {
  criteria: string;
  score: number;
}

export interface Review {
  id?: number;
  reviewer: {
    id: number;
    username?: string;
    fullName?: string;
  };
  reviewee: any;
  internship: any;
  comment: string;
  reviewDate?: string;
  enterprise?: any;
  scores: ReviewScore[];
}
export enum RatingCriteria {
  MENTORSHIP_QUALITY = 'MENTORSHIP_QUALITY',
  SKILL_DEVELOPMENT = 'SKILL_DEVELOPMENT',
  WORKLOAD_MANAGEMENT = 'WORKLOAD_MANAGEMENT',
  COMMUNICATION = 'COMMUNICATION',
  OVERALL_EXPERIENCE = 'OVERALL_EXPERIENCE',
}
