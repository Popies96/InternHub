import {User} from "./User";
import {Task} from "./Task";

export enum InternshipStatus {
  OPEN = "OPEN",
  FILLED = "FILLED",
  CLOSED = "CLOSED"
}

export interface Internship {
  id?: number;
  title: string;
  description: string;
  location: string;
  durationInMonths: number;
  startDate: string; // Assuming date is stored as a string in ISO format
  endDate: string;
  status: InternshipStatus;
  enterprise: User; // Enterprise offering the internship
  student?: User; // Student assigned to the internship
  tasks?: Task[]; // Tasks related to this internship
}
