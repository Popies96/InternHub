

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