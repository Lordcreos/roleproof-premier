import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Mail } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ReportView } from "../components/report/ReportView";
import { ErrorPanel, LoadingPanel } from "../components/ui/Primitives";
import { candidateProfile } from "../data/candidate-profile";
import { getPublicReport } from "../services/roleproof-service";
import { useHydrated } from "../lib/use-hydrated";

export function PublicReportPage({ slug }: { slug: string }) {
  const hydrated = useHydrated();
  const reportQuery = useQuery({
    queryKey: ["public-report", slug],
    queryFn: () => getPublicReport(slug),
    enabled: hydrated,
  });

  if (!hydrated || reportQuery.isLoading) {
    return <main className="section-pad"><LoadingPanel title="Loading public RoleProof" /></main>;
  }
  if (!reportQuery.data) {
    return (
      <main className="public-missing section-pad">
        <ErrorPanel
          title="This RoleProof is not public"
          detail="The owner may have disabled the link, or the URL may be incorrect."
          action={<Link className="button button-small" to="/"><ArrowLeft size={16} /> RoleProof home</Link>}
        />
      </main>
    );
  }

  return (
    <main className="public-report">
      <nav className="public-nav">
        <Link className="brand" to="/"><span className="brand-mark">R</span><span>RoleProof</span></Link>
        <span>Verified candidate evidence</span>
      </nav>
      <ReportView report={reportQuery.data} publicView />
      <section className="public-contact">
        <div>
          <p className="eyebrow">Candidate</p>
          <h2>{candidateProfile.name}</h2>
          <p>{candidateProfile.title} · {candidateProfile.location}</p>
        </div>
        <a className="button button-light" href="mailto:hello@example.com">
          <Mail size={18} /> Start a conversation
        </a>
      </section>
    </main>
  );
}