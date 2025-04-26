export interface Task {
  id:number;
  title: string;
  description: string;
  status: string;
  responseType: string;
}

export interface InternshipAi {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  technology: string;
  companyName: string;
  category: string;
  active: boolean;
  taskAiList: Task[];
}
export class Certificate {
  id?: number;
  title?: string;
  issueDate?: Date;
  verificationID?: string;
  status?: 'ACTIVE' | 'REVOKED';
  certificateContent?: string;
  studentId?: number;
  studentFirstName?: string;
  internshipTitle?: string;
  studentLastName?: string;
  internshipId?: number;
  issuerId?: number;
  issuerCompanyName?: string;
}  