/*import { Enterprise } from "./Entreprise";

import { User } from "./User"; // Ensure this model exists
import { Internship } from "./Internship"; // Ensure this model exists
import { ReviewScore } from "./ReviewScore"; // Ensure this model exists

export interface Review {
  id?: number;
  revieweeId: number;
  reviewerId: number;
  comment: string;
  rating: number;
  reviewDate: string;
  reviewer?: User;
  enterprise?: Enterprise;
  scores: ReviewScore[];
}
*/

export interface ReviewScore {
  criteria: string;
  score: number;
}

export interface Review {
  id?: number;
  reviewer: any;
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
  OVERALL_EXPERIENCE = 'OVERALL_EXPERIENCE'
}
