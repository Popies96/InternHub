export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED"
}

export interface Task {
  id?: number;
  title: string;
  description: string;
  status: TaskStatus;
  internshipId: number;  // The internship this task belongs to
}
