import { SkillBadge } from "./skillbadge";

export class Certificate {
    id?: number;
    title?: string;
    issueDate?: Date;
    verificationID?: string;
    status?: 'ACTIVE' | 'REVOKED';
    certificateContent?: string;
    studentId?: number;
    studentFirstName?: string;  
    issuerFirstName?: string;
    issuerLastName?: string;
    internshipTitle?: string;
    studentLastName?: string;
    internshipId?: number;
    issuerId?: number;
    skillBadges?: SkillBadge[];
  }  