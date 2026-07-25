export type FitLabel =
  | "strong-fit"
  | "promising-fit"
  | "partial-fit"
  | "stretch-opportunity";

export type MatchStatus = "strong" | "partial" | "missing" | "unclear";
export type Confidence = "high" | "medium" | "low";

export interface CandidateLink {
  label: string;
  url: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  summary: string;
  highlights: string[];
  technologies: string[];
}

export interface Project {
  id: string;
  name: string;
  summary: string;
  contribution: string[];
  technologies: string[];
  outcomes: string[];
}

export interface CandidateEvidence {
  id: string;
  sourceType: "experience" | "project" | "education" | "skill";
  sourceId: string;
  title: string;
  statement: string;
  technologies: string[];
  tags: string[];
}

export interface CandidateProfile {
  id: string;
  slug: string;
  name: string;
  title: string;
  location: string;
  availability: string;
  workAuthorization: string;
  summary: string;
  skills: Record<string, string[]>;
  experiences: Experience[];
  projects: Project[];
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    period: string;
    detail: string;
  }>;
  evidence: CandidateEvidence[];
  links: CandidateLink[];
}

export interface JobAnalysisInput {
  companyName: string;
  roleTitle: string;
  companyUrl?: string;
  jobDescription: string;
  language: "en" | "de" | "es";
  focusArea:
    | "technical-fit"
    | "product-fit"
    | "startup-fit"
    | "leadership-potential"
    | "ai-experience";
}

export interface JobRequirement {
  id: string;
  category:
    | "technical"
    | "product"
    | "industry"
    | "education"
    | "language"
    | "location"
    | "soft-skill"
    | "other";
  title: string;
  description: string;
  importance: "required" | "preferred" | "nice-to-have";
  keywords: string[];
}

export interface RequirementMatch {
  requirementId: string;
  status: MatchStatus;
  evidenceIds: string[];
  explanation: string;
  confidence: Confidence;
}

export interface EvidenceSummary {
  claim: string;
  sourceId: string;
  whyItMatters: string;
  confidence: Confidence;
  requirementIds: string[];
}

export interface GapAnalysis {
  requirementId: string;
  gap: string;
  currentEvidence: string;
  riskLevel: "low" | "medium" | "high";
  mitigation: string;
  interviewExplanation: string;
}

export interface InterviewQuestion {
  category: "technical" | "product" | "candidate-specific";
  question: string;
  reason: string;
  relatedRequirementIds: string[];
  preparationNotes: string;
}

export interface ProductIdea {
  problemHypothesis: string;
  targetUser: string;
  proposedFeature: string;
  workflow: string[];
  candidateContribution: string;
  expectedImpact: string;
  successMetrics: string[];
  risks: string[];
  mvpScope: string[];
  assumptions: string[];
}

export interface RoleProofReport {
  id: string;
  applicationId: string;
  candidateId: string;
  companyName: string;
  roleTitle: string;
  companyUrl?: string;
  fitLabel: FitLabel;
  executiveSummary: string;
  requirements: JobRequirement[];
  matches: RequirementMatch[];
  strongestEvidence: EvidenceSummary[];
  relevantProjectIds: string[];
  gaps: GapAnalysis[];
  interviewQuestions: InterviewQuestion[];
  thirtyDayPlan: {
    days1to7: string[];
    days8to15: string[];
    days16to30: string[];
  };
  productIdea: ProductIdea;
  publicSlug: string;
  isPublic: boolean;
  generatedAt: string;
  accessToken?: string;
}

export interface CoverLetterParagraph {
  id: string;
  text: string;
  evidenceIds: string[];
}

export interface CoverLetterQuality {
  specificity: number;
  evidenceCoverage: number;
  naturalLanguage: number;
  unsupportedClaims: string[];
  repetitionWarnings: string[];
  lengthStatus: "too-short" | "within-target" | "too-long";
  summary: string;
}

export interface CoverLetterDocument {
  id: string;
  reportId: string;
  tone: string;
  targetLength: "short" | "standard" | "detailed";
  variant: "recruiter" | "hiring-manager" | "startup-founder";
  subjectLine: string;
  greeting: string;
  paragraphs: CoverLetterParagraph[];
  closing: string;
  selectedEvidenceIds: string[];
  quality: CoverLetterQuality;
  updatedAt: string;
}

export interface CoverLetterRequest {
  reportId: string;
  tone: string;
  targetLength: "short" | "standard" | "detailed";
  variant: "recruiter" | "hiring-manager" | "startup-founder";
  selectedEvidenceIds: string[];
  excludedEvidenceIds: string[];
  candidateNote: string;
}
