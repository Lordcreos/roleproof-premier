import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  CircleHelp,
  Lightbulb,
  Quote,
} from "lucide-react";
import { candidateProfile } from "../../data/candidate-profile";
import { formatDate } from "../../lib/utils";
import type {
  Confidence,
  FitLabel,
  MatchStatus,
  RoleProofReport,
} from "../../types/domain";
import { Badge, Eyebrow, SectionHeading } from "../ui/Primitives";

const fitLabels: Record<FitLabel, string> = {
  "strong-fit": "Strong fit",
  "promising-fit": "Promising fit",
  "partial-fit": "Partial fit",
  "stretch-opportunity": "Stretch opportunity",
};

const statusLabels: Record<MatchStatus, string> = {
  strong: "Strong",
  partial: "Partial",
  missing: "Missing",
  unclear: "Unclear",
};

function statusTone(status: MatchStatus) {
  if (status === "strong") return "good" as const;
  if (status === "partial") return "warn" as const;
  return "risk" as const;
}

function confidenceTone(confidence: Confidence) {
  return confidence === "high" ? "good" : confidence === "medium" ? "warn" : "risk";
}

export function ReportView({
  report,
  publicView = false,
}: {
  report: RoleProofReport;
  publicView?: boolean;
}) {
  const projectMap = new Map(candidateProfile.projects.map((project) => [project.id, project]));
  const evidenceMap = new Map(candidateProfile.evidence.map((evidence) => [evidence.id, evidence]));

  return (
    <article className="report-view">
      <header className="report-header">
        <div>
          <Eyebrow>{publicView ? "Public RoleProof" : "RoleProof analysis"}</Eyebrow>
          <p className="report-kicker">{report.roleTitle}</p>
          <h1>{report.companyName}</h1>
          <div className="report-byline">
            <span>Prepared for {candidateProfile.name}</span>
            <span>{formatDate(report.generatedAt)}</span>
          </div>
        </div>
        <div className="fit-seal">
          <span>RP</span>
          <strong>{fitLabels[report.fitLabel]}</strong>
          <small>Evidence reviewed</small>
        </div>
      </header>

      <section className="report-summary">
        <Badge tone="good">{fitLabels[report.fitLabel]}</Badge>
        <Quote aria-hidden />
        <h2>{report.executiveSummary}</h2>
        <p>
          This label is qualitative. It is based on the requirement-to-evidence
          mapping below, not an unexplained score.
        </p>
      </section>

      <section className="report-section">
        <SectionHeading
          eyebrow="01 / Requirements"
          title="What the role appears to need."
          detail="Explicit and implied requirements extracted from the supplied description."
        />
        <div className="requirements-list">
          {report.requirements.map((requirement) => {
            const match = report.matches.find((item) => item.requirementId === requirement.id);
            return (
              <article className="requirement-card" key={requirement.id}>
                <div className="requirement-top">
                  <div>
                    <span className="requirement-category">{requirement.category}</span>
                    <h3>{requirement.title}</h3>
                  </div>
                  <Badge tone={statusTone(match?.status ?? "unclear")}>
                    {statusLabels[match?.status ?? "unclear"]}
                  </Badge>
                </div>
                <p>{requirement.description}</p>
                {match ? (
                  <div className="match-explanation">
                    <p>{match.explanation}</p>
                    <div className="tag-row">
                      {match.evidenceIds.map((id) => (
                        <span className="evidence-chip" key={id}>
                          {evidenceMap.get(id)?.title ?? id}
                        </span>
                      ))}
                      <Badge tone={confidenceTone(match.confidence)}>
                        {match.confidence} confidence
                      </Badge>
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>

      <section className="report-section evidence-section">
        <SectionHeading
          eyebrow="02 / Strongest evidence"
          title="The claims with something behind them."
        />
        <div className="evidence-grid">
          {report.strongestEvidence.map((item, index) => {
            const source = evidenceMap.get(item.sourceId);
            return (
              <article className="evidence-card" key={`${item.sourceId}-${index}`}>
                <div className="evidence-card-top">
                  <span>E{index + 1}</span>
                  <Badge tone={confidenceTone(item.confidence)}>{item.confidence}</Badge>
                </div>
                <h3>{item.claim}</h3>
                <p>{item.whyItMatters}</p>
                <div className="evidence-source">
                  <CheckCircle2 size={16} />
                  <div><small>Verified source</small><strong>{source?.title ?? item.sourceId}</strong></div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="report-section">
        <SectionHeading eyebrow="03 / Relevant work" title="Projects to open in the interview." />
        <div className="report-projects">
          {report.relevantProjectIds.map((id) => {
            const project = projectMap.get(id);
            if (!project) return null;
            return (
              <article key={id}>
                <div>
                  <h3>{project.name}</h3>
                  <p>{project.summary}</p>
                </div>
                <div className="tag-row">
                  {project.technologies.map((technology) => (
                    <span className="tag" key={technology}>{technology}</span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="report-section">
        <SectionHeading
          eyebrow="04 / Gaps & risk"
          title="No evidence means no claim."
          detail="These areas deserve preparation, not optimistic rewriting."
        />
        <div className="gaps-list">
          {report.gaps.map((gap) => (
            <article key={`${gap.requirementId}-${gap.gap}`}>
              <div className="gap-title">
                <AlertTriangle />
                <div>
                  <Badge tone={gap.riskLevel === "high" ? "risk" : "warn"}>
                    {gap.riskLevel} risk
                  </Badge>
                  <h3>{gap.gap}</h3>
                </div>
              </div>
              <dl>
                <div><dt>Current evidence</dt><dd>{gap.currentEvidence}</dd></div>
                <div><dt>Mitigation</dt><dd>{gap.mitigation}</dd></div>
                <div><dt>Interview framing</dt><dd>{gap.interviewExplanation}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="report-section">
        <SectionHeading
          eyebrow="05 / Interview prep"
          title="Questions this evidence should survive."
        />
        <div className="questions-list">
          {report.interviewQuestions.map((item, index) => (
            <article key={item.question}>
              <span className="question-number">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <Badge tone="neutral">{item.category}</Badge>
                <h3>{item.question}</h3>
                <p>{item.reason}</p>
                <div className="prep-note">
                  <CircleHelp size={17} />
                  <span><strong>Prepare:</strong> {item.preparationNotes}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="report-section">
        <SectionHeading
          eyebrow="06 / First 30 days"
          title="A realistic first contribution."
        />
        <div className="timeline-grid">
          {[
            ["Days 1–7", report.thirtyDayPlan.days1to7],
            ["Days 8–15", report.thirtyDayPlan.days8to15],
            ["Days 16–30", report.thirtyDayPlan.days16to30],
          ].map(([label, items]) => (
            <article key={label as string}>
              <p className="timeline-label">{label as string}</p>
              <ul>
                {(items as string[]).map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="report-section product-idea">
        <SectionHeading
          eyebrow="07 / Product idea"
          title={report.productIdea.proposedFeature}
          detail="A small, discussable hypothesis—not a claim about the company roadmap."
        />
        <div className="idea-hero">
          <Lightbulb />
          <div><small>Problem hypothesis</small><p>{report.productIdea.problemHypothesis}</p></div>
        </div>
        <div className="idea-grid">
          <div><h3>Target user</h3><p>{report.productIdea.targetUser}</p></div>
          <div><h3>Expected impact</h3><p>{report.productIdea.expectedImpact}</p></div>
          <div><h3>Why Leonardo</h3><p>{report.productIdea.candidateContribution}</p></div>
          <div>
            <h3>Small MVP</h3>
            <ul>{report.productIdea.mvpScope.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>
        <div className="assumptions">
          <strong>Assumptions to validate</strong>
          {report.productIdea.assumptions.map((item) => <p key={item}>{item}</p>)}
        </div>
      </section>

      <section className="report-section evidence-map">
        <SectionHeading eyebrow="08 / Evidence map" title="Trace every source." />
        {candidateProfile.evidence
          .filter((evidence) =>
            report.strongestEvidence.some((item) => item.sourceId === evidence.id) ||
            report.matches.some((match) => match.evidenceIds.includes(evidence.id)),
          )
          .map((evidence) => (
            <div key={evidence.id}>
              <span>{evidence.id}</span>
              <div><strong>{evidence.title}</strong><p>{evidence.statement}</p></div>
              <ArrowUpRight size={17} />
            </div>
          ))}
      </section>
    </article>
  );
}
