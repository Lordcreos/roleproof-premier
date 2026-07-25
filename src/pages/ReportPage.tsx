import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Check,
  Copy,
  ExternalLink,
  FileText,
  Lock,
  Printer,
  Share2,
} from "lucide-react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ReportView } from "../components/report/ReportView";
import { ErrorPanel, LoadingPanel } from "../components/ui/Primitives";
import { getReport, setReportSharing } from "../services/roleproof-service";
import { useHydrated } from "../lib/use-hydrated";
import { formatDate } from "../lib/utils";

export function ReportPage({ id }: { id: string }) {
  const hydrated = useHydrated();
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const reportQuery = useQuery({
    queryKey: ["report", id],
    queryFn: () => getReport(id),
    enabled: hydrated,
  });

  if (!hydrated || reportQuery.isLoading) {
    return <div className="section-pad"><LoadingPanel title="Opening the evidence file" /></div>;
  }
  if (reportQuery.isError || !reportQuery.data) {
    return (
      <div className="section-pad narrow-state">
        <ErrorPanel
          title="Report not found"
          detail="This report may have expired or the link may be incomplete."
          action={<Link className="button button-small" to="/lab">Create a new report</Link>}
        />
      </div>
    );
  }

  const report = reportQuery.data;
  const shareUrl = `${window.location.origin}/r/${report.publicSlug}`;
  const generated = formatDate(report.generatedAt);

  const toggleSharing = async () => {
    setShareError(null);
    try {
      const updated = await setReportSharing(report, !report.isPublic);
      queryClient.setQueryData(["report", id], updated);
    } catch (error) {
      setShareError(error instanceof Error ? error.message : "Could not update sharing.");
    }
  };

  const copyShareLink = async () => {
    if (!report.isPublic) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <div className="report-page">
      <div className="report-toolbar no-print" role="region" aria-label="Report controls">
        <div className="toolbar-status">
          <span className={report.isPublic ? "status-dot live" : "status-dot"} aria-hidden />
          <div>
            <strong>{report.isPublic ? "Public link active" : "Private draft"}</strong>
            <small>Generated {generated}</small>
          </div>
        </div>
        <div className="toolbar-actions">
          <button
            className="toolbar-button toolbar-primary"
            type="button"
            onClick={toggleSharing}
            aria-pressed={report.isPublic}
          >
            {report.isPublic ? <Lock size={16} /> : <Share2 size={16} />}
            {report.isPublic ? "Make private" : "Enable public link"}
          </button>
          <button
            className="toolbar-button"
            type="button"
            onClick={copyShareLink}
            disabled={!report.isPublic}
            aria-live="polite"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied" : "Copy link"}
          </button>
          {report.isPublic ? (
            <a className="toolbar-button" href={shareUrl} target="_blank" rel="noreferrer">
              <ExternalLink size={16} /> Preview
            </a>
          ) : null}
          <button className="toolbar-button" type="button" onClick={handlePrint}>
            <Printer size={16} /> Print
          </button>
        </div>
      </div>
      {shareError ? <p className="toolbar-error no-print" role="alert">{shareError}</p> : null}
      <ReportView report={report} />
      <section className="report-cta">
        <div>
          <p className="eyebrow">Same evidence. New format.</p>
          <h2>Turn this report into a cover letter.</h2>
          <p>Select the proof you want to emphasize, then edit the result in your own voice.</p>
        </div>
        <Link className="button button-light" to="/reports/$id/cover-letter" params={{ id: report.id }}>
          <FileText size={18} /> Open Cover Letter Studio
        </Link>
      </section>
    </div>
  );
}