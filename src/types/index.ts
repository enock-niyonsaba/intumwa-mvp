export type ComplaintStatus = 'Received' | 'Under Review' | 'Resolved';

export type ComplaintCategory = 
  | 'Infrastructure'
  | 'Public Safety'
  | 'Environmental'
  | 'Social Services'
  | 'Other';

export interface Complaint {
  id: string;
  fullName: string;
  contactInfo?: string;
  category: ComplaintCategory;
  description: string;
  status: ComplaintStatus;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Department {
  id: string;
  name: string;
  categories: ComplaintCategory[];
} 