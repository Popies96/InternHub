import {Internship} from "./Internship";

export enum UserRole {
  STUDENT = "STUDENT",
  ENTERPRISE = "ENTERPRISE",
  ADMIN = "ADMIN"
}

export interface User {
  id?: number;
  nom: string;
  prenom: string;
  password: string;
  email: string;
  phone: number;
  role: UserRole;
  createdInternships?: Internship[]; // Internships created by an enterprise
  appliedInternships?: Internship[]; // Internships applied by a student
}
