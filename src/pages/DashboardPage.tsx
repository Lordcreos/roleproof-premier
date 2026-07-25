import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Briefcase,
  FileText,
  Plus,
  Sparkles,
  Target,
} from "lucide-react";
import { useAuth } from "../lib/auth";
import { useHydrated } from "../lib/use-hydrated";
import {
  STATUS_LABELS,
  listApplications,
  type ApplicationRecord,
} from "../lib/applications";
import { Eyebrow, EmptyPanel, LoadingPanel } from "../components/ui/Primitives";
import { formatDate } from "../lib/utils";
import { FitPill } from "../components/shared/FitPill";

export function DashboardPage() {
  const hydrated = useHydrated();
  const { account } = useAuth();

  const applications = useMemo<ApplicationRecord[]>(
    () => (hydrated ? listApplications() : []),
    [hydrated],
  );

  if (!hydrated) return <LoadingPanel title="Opening your workspace" />;

  const totals = {
    all: applications.length,
    active: applications.filter((a) => ["draft", "applied", "interviewing"].includes(a.status)).length,
    interviewing: applications.filter((a) => a.status === "interviewing").length,
    strong: applications.filter((a) => a.fitLabel === "strong-fit" || a.fitLabel === "promising-fit").length,
  };

  const recent = applications.slice(0, 5);
  const firstName = (account?.name ?? account?.email ?? "there").split(/[\s@]/)[0];

  return (
    <div className="dashboard">
      <header className="dashboard-hero">
        <div>
          <Eyebrow>Workspace</Eyebrow>
          <h1>Welcome back, {firstName}.</h1>
          <p>Every application here is backed by verified evidence. Nothing invented.</p>
        </div>
        <div className="dashboard-hero-actions">
          <Link className="button" to="/lab"><Plus size={16} /> New RoleProof</Link>
          <Link className="text-link" to="/app/applications">See all applications <ArrowUpRight size={14} /></Link>
        </div>
      </header>

      <section className="metric-grid" aria-label="Workspace metrics">
        <MetricCard icon={Briefcase} label="Applications" value={totals.all} detail="Across all statuses" />
        <MetricCard icon={Target} label="Active" value={totals.active} detail="Draft · Applied · Interviewing" />
        <MetricCard icon={Sparkles} label="Interviewing" value={totals.interviewing} detail="Currently in-flight" />
        <MetricCard icon={FileText} label="Strong fits" value={totals.strong} detail="Strong or promising match" />
      </section>

      <section className="dashboard-panel">
        <div className="panel-head">
          <div>
            <Eyebrow>Recent applications</Eyebrow>
            <h2>Latest RoleProofs</h2>
          </div>
          <Link className="text-link" to="/app/applications">View all</Link>
        </div>

        {recent.length === 0 ? (
          <EmptyPanel
            title="No applications yet"
            detail="Generate your first RoleProof — the report will land here with fit, gaps and a plan."
            action={<Link className="button" to="/lab"><Plus size={16} /> Generate a RoleProof</Link>}
          />
        ) : (
          <ul className="app-list">
            {recent.map((item) => (
              <li key={item.id}>
                <Link to="/reports/$id" params={{ id: item.reportId }} className="app-row">
                  <div className="app-row-main">
                    <strong>{item.roleTitle}</strong>
                    <span>{item.companyName}</span>
                  </div>
                  <div className="app-row-meta">
                    <FitPill label={item.fitLabel} />
                    <span className={`status status-${item.status}`}>{STATUS_LABELS[item.status]}</span>
                    <time dateTime={item.updatedAt}>{formatDate(item.updatedAt)}</time>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="dashboard-panel dashboard-cta">
        <div>
          <Eyebrow>Next step</Eyebrow>
          <h2>Turn a report into a letter.</h2>
          <p>Every cover letter references the same verified evidence. No generic paragraphs.</p>
        </div>
        <Link className="button button-light" to="/leonardo-sanchez">
          Review the evidence profile
        </Link>
      </section>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof Briefcase;
  label: string;
  value: number;
  detail: string;
}) {
  return (
    <article className="metric-card">
      <span className="metric-icon"><Icon size={16} aria-hidden /></span>
      <p className="metric-label">{label}</p>
      <p className="metric-value">{value}</p>
      <p className="metric-detail">{detail}</p>
    </article>
  );
}