import { z } from "zod";

export const jobAnalysisInputSchema = z.object({
  companyName: z.string().trim().min(1, "Company name is required").max(160),
  roleTitle: z.string().trim().min(1, "Role title is required").max(160),
  companyUrl: z
    .string()
    .trim()
    .url("Enter a valid URL")
    .optional()
    .or(z.literal("")),
  jobDescription: z
    .string()
    .trim()
    .min(200, "Add at least 200 characters from the job description")
    .max(30_000),
  language: z.enum(["en", "de", "es"]),
  focusArea: z.enum([
    "technical-fit",
    "product-fit",
    "startup-fit",
    "leadership-potential",
    "ai-experience",
  ]),
});

const requirementSchema = z.object({
  id: z.string(),
  category: z.enum([
    "technical",
    "product",
    "industry",
    "education",
    "language",
    "location",
    "soft-skill",
    "other",
  ]),
  title: z.string(),
  description: z.string(),
  importance: z.enum(["required", "preferred", "nice-to-have"]),
  keywords: z.array(z.string()),
});

export const roleProofReportSchema = z.object({
  id: z.string(),
  applicationId: z.string(),
  candidateId: z.string(),
  companyName: z.string(),
  roleTitle: z.string(),
  companyUrl: z.string().optional(),
  fitLabel: z.enum([
    "strong-fit",
    "promising-fit",
    "partial-fit",
    "stretch-opportunity",
  ]),
  executiveSummary: z.string(),
  requirements: z.array(requirementSchema).min(1),
  matches: z.array(
    z.object({
      requirementId: z.string(),
      status: z.enum(["strong", "partial", "missing", "unclear"]),
      evidenceIds: z.array(z.string()),
      explanation: z.string(),
      confidence: z.enum(["high", "medium", "low"]),
    }),
  ),
  strongestEvidence: z.array(
    z.object({
      claim: z.string(),
      sourceId: z.string(),
      whyItMatters: z.string(),
      confidence: z.enum(["high", "medium", "low"]),
      requirementIds: z.array(z.string()),
    }),
  ),
  relevantProjectIds: z.array(z.string()),
  gaps: z.array(
    z.object({
      requirementId: z.string(),
      gap: z.string(),
      currentEvidence: z.string(),
      riskLevel: z.enum(["low", "medium", "high"]),
      mitigation: z.string(),
      interviewExplanation: z.string(),
    }),
  ),
  interviewQuestions: z.array(
    z.object({
      category: z.enum(["technical", "product", "candidate-specific"]),
      question: z.string(),
      reason: z.string(),
      relatedRequirementIds: z.array(z.string()),
      preparationNotes: z.string(),
    }),
  ),
  thirtyDayPlan: z.object({
    days1to7: z.array(z.string()),
    days8to15: z.array(z.string()),
    days16to30: z.array(z.string()),
  }),
  productIdea: z.object({
    problemHypothesis: z.string(),
    targetUser: z.string(),
    proposedFeature: z.string(),
    workflow: z.array(z.string()),
    candidateContribution: z.string(),
    expectedImpact: z.string(),
    successMetrics: z.array(z.string()),
    risks: z.array(z.string()),
    mvpScope: z.array(z.string()),
    assumptions: z.array(z.string()),
  }),
  publicSlug: z.string(),
  isPublic: z.boolean(),
  generatedAt: z.string(),
  accessToken: z.string().optional(),
});

export const waitlistSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(320),
});
