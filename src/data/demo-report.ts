import { candidateProfile } from "./candidate-profile";
import type {
  CoverLetterDocument,
  CoverLetterRequest,
  JobAnalysisInput,
  RoleProofReport,
} from "../types/domain";
import { countWords, makeLocalId } from "../lib/utils";

const delay = (milliseconds: number) =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds));

export async function buildDemoReport(
  input: JobAnalysisInput,
): Promise<RoleProofReport> {
  await delay(850);
  const reportId = makeLocalId("report");
  const applicationId = makeLocalId("application");
  const roleLower = `${input.roleTitle} ${input.jobDescription}`.toLowerCase();
  const wantsAi = /\b(ai|artificial intelligence|llm|machine learning)\b/.test(roleLower);
  const wantsBackend = /\b(node|backend|api|nestjs|full.?stack)\b/.test(roleLower);

  const requirements = [
    {
      id: "req-frontend-architecture",
      category: "technical" as const,
      title: "Scalable frontend architecture",
      description:
        "Build maintainable product interfaces with reusable components and clear boundaries.",
      importance: "required" as const,
      keywords: ["React", "TypeScript", "architecture"],
    },
    {
      id: "req-product-delivery",
      category: "product" as const,
      title: "Product-minded delivery",
      description:
        "Translate ambiguous needs into useful, testable product improvements.",
      importance: "required" as const,
      keywords: ["product", "iteration", "collaboration"],
    },
    {
      id: "req-backend",
      category: "technical" as const,
      title: wantsBackend ? "Full-stack implementation" : "API collaboration",
      description: wantsBackend
        ? "Work across frontend and server-side services."
        : "Collaborate effectively with APIs and backend systems.",
      importance: "preferred" as const,
      keywords: ["Node.js", "NestJS", "API"],
    },
    {
      id: "req-domain",
      category: "industry" as const,
      title: `${input.companyName} domain context`,
      description:
        "Bring enough domain context to make sound trade-offs quickly.",
      importance: "preferred" as const,
      keywords: ["domain knowledge"],
    },
    ...(wantsAi
      ? [
          {
            id: "req-ai-product",
            category: "technical" as const,
            title: "Practical AI product experience",
            description:
              "Turn model capabilities into reliable, user-centered product workflows.",
            importance: "preferred" as const,
            keywords: ["AI", "product", "LLM"],
          },
        ]
      : []),
  ];

  return {
    id: reportId,
    applicationId,
    candidateId: candidateProfile.id,
    companyName: input.companyName,
    roleTitle: input.roleTitle,
    companyUrl: input.companyUrl || undefined,
    fitLabel: wantsAi ? "promising-fit" : "strong-fit",
    executiveSummary: `Leonardo brings direct evidence for the frontend systems and product delivery expected from a ${input.roleTitle}. His configuration-driven Next.js work and full-stack ERP experience map well to the role's core execution needs. The main uncertainty is company-specific domain depth, which should be explored honestly rather than assumed.`,
    requirements,
    matches: [
      {
        requirementId: "req-frontend-architecture",
        status: "strong",
        evidenceIds: ["project-dynamic-pages", "exp-frontend-systems"],
        explanation:
          "The Dynamic Pages Platform demonstrates reusable UI architecture, conditional validation and configuration-driven rendering.",
        confidence: "high",
      },
      {
        requirementId: "req-product-delivery",
        status: "strong",
        evidenceIds: ["project-teacher-dashboard", "project-ai-sales-copilot"],
        explanation:
          "Both projects connect implementation choices to a concrete user workflow and product outcome.",
        confidence: "high",
      },
      {
        requirementId: "req-backend",
        status: "strong",
        evidenceIds: ["project-erp", "project-interview-automation"],
        explanation:
          "React frontends were delivered alongside NestJS, Node.js and C# services.",
        confidence: "high",
      },
      {
        requirementId: "req-domain",
        status: "unclear",
        evidenceIds: [],
        explanation:
          "The supplied profile does not verify prior experience in the company's exact domain.",
        confidence: "high",
      },
      ...(wantsAi
        ? [
            {
              requirementId: "req-ai-product",
              status: "partial" as const,
              evidenceIds: ["project-ai-sales-copilot", "edu-ai-data-science"],
              explanation:
                "There is verified AI product prototyping and current graduate study, but no claim is made about production-scale model operations.",
              confidence: "high" as const,
            },
          ]
        : []),
    ],
    strongestEvidence: [
      {
        claim:
          "Leonardo has built complex React interfaces from structured configuration.",
        sourceId: "project-dynamic-pages",
        whyItMatters:
          "This is direct evidence of scalable frontend architecture and reusable product systems.",
        confidence: "high",
        requirementIds: ["req-frontend-architecture"],
      },
      {
        claim:
          "Leonardo has worked across React microfrontends and NestJS microservices.",
        sourceId: "project-erp",
        whyItMatters:
          "The role can rely on someone who understands both UI delivery and service boundaries.",
        confidence: "high",
        requirementIds: ["req-backend", "req-product-delivery"],
      },
      ...(wantsAi
        ? [
            {
              claim:
                "Leonardo has prototyped a multi-channel AI sales workflow and is studying AI and Data Science.",
              sourceId: "project-ai-sales-copilot",
              whyItMatters:
                "It shows practical interest in shaping AI capabilities into user workflows.",
              confidence: "medium" as const,
              requirementIds: ["req-ai-product"],
            },
          ]
        : []),
    ],
    relevantProjectIds: [
      "project-dynamic-pages",
      "project-erp",
      wantsAi ? "project-ai-sales-copilot" : "project-teacher-dashboard",
    ],
    gaps: [
      {
        requirementId: "req-domain",
        gap: `No verified prior experience in ${input.companyName}'s exact domain.`,
        currentEvidence:
          "The profile shows fast product-context learning across ERP, education, interview and sales workflows.",
        riskLevel: "medium",
        mitigation:
          "Prepare a short domain map from public material and validate it with the team during interviews.",
        interviewExplanation:
          "Be direct about the learning curve, then show how previous products required translating unfamiliar workflows into working interfaces.",
      },
      ...(wantsAi
        ? [
            {
              requirementId: "req-ai-product",
              gap: "Production-scale model operations are not verified in the profile.",
              currentEvidence:
                "AI Sales Copilot prototyping and current AI/Data Science studies.",
              riskLevel: "medium" as const,
              mitigation:
                "Frame the strongest contribution as product engineering around AI systems and ask about the team's production stack.",
              interviewExplanation:
                "Separate proven product prototyping from unverified MLOps depth; do not overclaim.",
            },
          ]
        : []),
    ],
    interviewQuestions: [
      {
        category: "technical",
        question:
          "How did you keep configuration-driven forms type-safe as their complexity grew?",
        reason:
          "The interviewer may test whether the Dynamic Pages architecture held up beyond the initial prototype.",
        relatedRequirementIds: ["req-frontend-architecture"],
        preparationNotes:
          "Explain schema boundaries, conditional validation and how reusable components consumed configuration.",
      },
      {
        category: "product",
        question:
          "How do you decide when a workflow needs a reusable system instead of a one-off screen?",
        reason:
          "The role appears to combine product judgment with frontend architecture.",
        relatedRequirementIds: ["req-product-delivery", "req-frontend-architecture"],
        preparationNotes:
          "Compare the repeated ERP workflows with the configuration-driven page platform.",
      },
      {
        category: "candidate-specific",
        question:
          "Which part of your full-stack experience would help you contribute fastest here?",
        reason:
          "The profile spans several technologies, so the interviewer may want a focused answer.",
        relatedRequirementIds: ["req-backend"],
        preparationNotes:
          "Anchor the answer in the role description and choose one frontend plus one service-side example.",
      },
    ],
    thirtyDayPlan: {
      days1to7: [
        `Map ${input.companyName}'s product, users and current frontend architecture.`,
        "Set up the development environment and trace one user journey end to end.",
        "Review design, API and testing conventions with the team.",
      ],
      days8to15: [
        "Ship one small UI or developer-experience improvement with a measurable outcome.",
        "Validate one architecture assumption with product and engineering.",
        "Document a reusable component or workflow opportunity.",
      ],
      days16to30: [
        `Own a scoped ${input.roleTitle} feature from definition through release.`,
        wantsAi
          ? "Propose one small AI-assisted workflow experiment with a human fallback."
          : "Propose one product workflow experiment grounded in observed user friction.",
        "Define success signals and share the next iteration with the team.",
      ],
    },
    productIdea: {
      problemHypothesis:
        "Candidates and hiring teams often lose the evidence behind a polished application claim.",
      targetUser: `Hiring teams and candidates interacting with ${input.companyName}`,
      proposedFeature: "Evidence-linked application brief",
      workflow: [
        "Select a role requirement.",
        "Attach a verified work example.",
        "Review gaps and confidence.",
        "Share a compact evidence brief.",
      ],
      candidateContribution:
        "Leonardo could combine reusable frontend architecture with structured, AI-assisted content generation.",
      expectedImpact:
        "Faster evaluation conversations with fewer generic claims and clearer follow-up questions.",
      successMetrics: [
        "Brief completion rate",
        "Evidence links opened",
        "Time to first meaningful recruiter response",
      ],
      risks: [
        "Users may over-trust generated language.",
        "Sensitive candidate data requires careful controls.",
      ],
      mvpScope: [
        "One candidate profile",
        "One role description",
        "Evidence map",
        "Shareable read-only brief",
      ],
      assumptions: [
        `Assumption: ${input.companyName} has workflows where structured evidence can improve a decision.`,
        "Assumption: users will review generated claims before sharing.",
      ],
    },
    publicSlug: `${input.companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${crypto
      .randomUUID()
      .slice(0, 12)}`,
    isPublic: false,
    generatedAt: new Date().toISOString(),
  };
}

export async function buildDemoCoverLetter(
  report: RoleProofReport,
  request: CoverLetterRequest,
): Promise<CoverLetterDocument> {
  await delay(650);
  const selected = request.selectedEvidenceIds;
  const opening =
    request.variant === "startup-founder"
      ? `The ${report.roleTitle} role at ${report.companyName} stands out because it sits where product judgment and hands-on engineering meet.`
      : `${report.companyName}'s ${report.roleTitle} role matches the kind of product engineering work I have been building toward: clear user problems, reusable frontend systems and practical delivery across the stack.`;

  const paragraphs = [
    {
      id: "opening",
      text: opening,
      evidenceIds: [],
    },
    {
      id: "evidence-1",
      text:
        "On the Dynamic Pages Platform, I built configuration-driven pages and dynamic forms with conditional validation, reusable components and Next.js server actions. That work taught me how to make complex interfaces easier to extend without hiding the constraints that keep them reliable.",
      evidenceIds: selected.includes("project-dynamic-pages")
        ? ["project-dynamic-pages"]
        : selected.slice(0, 1),
    },
    {
      id: "evidence-2",
      text:
        "I have also worked across React microfrontends and NestJS microservices for an ERP platform covering onboarding, contracts, payroll and project workflows. It is useful evidence that I can move between interface detail, service boundaries and the operational context behind a feature.",
      evidenceIds: selected.includes("project-erp")
        ? ["project-erp"]
        : selected.slice(1, 2),
    },
    {
      id: "motivation",
      text: `I would bring that same evidence-first approach to ${report.companyName}: learn the product and architecture quickly, ship a focused improvement early, and then take ownership of a scoped feature with a clear success signal. I would also be candid about the main gap in my current profile—the company's exact domain context—and close it through structured discovery rather than pretending it is already solved.`,
      evidenceIds: [],
    },
  ];

  const allText = paragraphs.map((paragraph) => paragraph.text).join(" ");
  const wordCount = countWords(allText);
  const targets = {
    short: [150, 220],
    standard: [220, 360],
    detailed: [360, 520],
  } as const;
  const [minimum, maximum] = targets[request.targetLength];

  return {
    id: makeLocalId("letter"),
    reportId: report.id,
    tone: request.tone,
    targetLength: request.targetLength,
    variant: request.variant,
    subjectLine: `${report.roleTitle} — evidence-backed application from Leonardo Sánchez`,
    greeting: "Hello hiring team,",
    paragraphs,
    closing:
      "I would welcome a conversation about the product challenges behind this role and where my experience could be useful first.\n\nLeonardo Sánchez",
    selectedEvidenceIds: selected,
    quality: {
      specificity: 9,
      evidenceCoverage: Math.min(10, 6 + selected.length),
      naturalLanguage: 9,
      unsupportedClaims: [],
      repetitionWarnings: [],
      lengthStatus:
        wordCount < minimum
          ? "too-short"
          : wordCount > maximum
            ? "too-long"
            : "within-target",
      summary:
        "The letter is role-specific, references verified project evidence and states the domain gap directly.",
    },
    updatedAt: new Date().toISOString(),
  };
}
