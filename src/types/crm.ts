export type ContactStatus = 'Active' | 'Inactive' | 'Prospect' | 'Champion';
export type LeadSource = 'Referral' | 'Conference' | 'Direct Outreach' | 'Website' | 'Hospital Network' | 'Inbound';
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Converted' | 'Lost';
export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type LeadPriority = Priority;
export type TaskPriority = Priority;
export type DealStage = 'Qualification' | 'Discovery' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
export type ActivityType = 'Call' | 'Email' | 'Meeting' | 'Note' | 'Follow-up';
export type ActivityStatus = 'Scheduled' | 'Completed' | 'Cancelled';
export type TaskStatus = 'Todo' | 'In Progress' | 'Completed';

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organization: string;
  jobTitle: string;
  status: ContactStatus;
  leadSource: LeadSource;
  tags: string[];
  notes: string;
  createdDate: string;
  lastActivity: string;
}

export interface Lead {
  id: string;
  leadName: string;
  organization: string;
  email: string;
  phone: string;
  source: LeadSource;
  status: LeadStatus;
  priority: Priority;
  owner: string;
  estimatedValue: number;
  createdDate: string;
  lastContacted: string;
  notes?: string;
}

export interface Deal {
  id: string;
  dealName: string;
  organization: string;
  contactId?: string;
  contactName: string;
  value: number;
  probability: number;
  expectedCloseDate: string;
  owner: string;
  stage: DealStage;
  notes?: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  contactId?: string;
  leadId?: string;
  dealId?: string;
  relatedName: string;
  type: ActivityType;
  subject: string;
  description: string;
  dateTime: string;
  status: ActivityStatus;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: TaskStatus;
  relatedType?: 'Contact' | 'Lead' | 'Deal' | 'General';
  relatedId?: string;
  relatedName?: string;
  assignedTo?: string;
  completedAt?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  relatedType?: 'Contact' | 'Lead' | 'Deal' | 'General';
  relatedId?: string;
  relatedName?: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  organization: string;
  phone: string;
  avatarUrl: string;
  territory?: string;
}

export interface OrgSettings {
  name: string;
  orgName?: string;
  domain: string;
  timezone: string;
  currency: string;
  address: string;
  industry?: string;
  complianceMode?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}
