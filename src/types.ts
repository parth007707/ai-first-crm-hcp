export type UserRole = 'QA_OFFICER' | 'PRODUCTION_MANAGER' | 'FIELD_REP';

export interface HCP {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  city: string;
  email: string;
  phone: string;
  lastInteractionDate?: string;
  preferredChannel: 'In-Person' | 'Virtual' | 'Email' | 'Advisory Call';
  complianceStatus: 'Approved' | 'Flagged' | 'Pending Review';
  prescribingTier: 'Tier 1 (High)' | 'Tier 2 (Moderate)' | 'Tier 3 (Emerging)';
}

export interface Interaction {
  id: string;
  hcpId: string;
  hcpName: string;
  specialty: string;
  date: string;
  type: 'In-Person Detail' | 'Virtual Advisory' | 'Sample Distribution' | 'Scientific Discussion' | 'Conference Follow-up';
  productsDiscussed: string[];
  keyNotes: string;
  samplesProvided?: { product: string; quantity: number }[];
  complianceCheck: {
    passed: boolean;
    flags: string[];
    validatedBy: string;
    timestamp: string;
  };
  followUpRecommendation?: string;
  followUpDate?: string;
  status: 'Draft' | 'Submitted' | 'Audited';
}

export type DeviationStage = 'Issue Logged' | 'Root Cause Analysis' | 'Action Planned' | 'Verified' | 'Closed';

export interface Deviation {
  id: string;
  title: string;
  batchNumber: string;
  productName: string;
  detectedAt: string;
  detectedBy: string;
  department: 'Production' | 'Packaging' | 'Quality Control' | 'Storage/Cold Chain';
  severity: 'Minor' | 'Major' | 'Critical';
  stage: DeviationStage;
  description: string;
  rootCause?: string;
  capaAction?: string;
  verificationNotes?: string;
  assignedRole: 'QA_OFFICER' | 'PRODUCTION_MANAGER';
  closedAt?: string;
}

export interface ProductComplaint {
  id: string;
  complaintNumber: string;
  reportedBy: string;
  reporterType: 'HCP' | 'Patient' | 'Distributor';
  product: string;
  batchNumber: string;
  dateReported: string;
  category: 'Packaging Defect' | 'Potency / Efficacy' | 'Particulate Matter' | 'Labeling';
  status: 'Under Investigation' | 'CAPA Initiated' | 'Resolved';
  resolutionSummary?: string;
}

export interface AdverseEvent {
  id: string;
  caseId: string;
  patientInitials: string;
  hcpReporter: string;
  suspectDrug: string;
  reactionDescription: string;
  reportedDate: string;
  seriousnessCriteria: 'Life Threatening' | 'Hospitalization' | 'Disability' | 'Medically Significant';
  fdaMdrStatus: 'Drafted' | 'Transmitted' | 'Acknowledged';
}

export interface ProductRecall {
  id: string;
  recallCode: string;
  productName: string;
  affectedBatches: string[];
  classification: 'Class I (Urgent)' | 'Class II' | 'Class III';
  initiationDate: string;
  status: 'Active Recall' | 'Quarantine Secured' | 'Final Reconciliation Completed';
  recoveryRatePercent: number;
  regulatoryNotified: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
  toolUsed?: 'HCP Lookup' | 'Log Interaction' | 'Edit Interaction' | 'Compliance Validator' | 'Follow-Up Recommendation';
  toolPayload?: any;
}
