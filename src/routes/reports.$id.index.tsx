import { createFileRoute } from "@tanstack/react-router";
import { ReportPage } from "../pages/ReportPage";

export const Route = createFileRoute("/reports/$id/")({
  head: () => ({
    meta: [
      { title: "RoleProof report" },
      { name: "description", content: "An evidence-backed fit analysis: mapped requirements, verified matches, honest gaps, interview prep and a first-30-days plan." },
      { property: "og:title", content: "RoleProof report — evidence-backed fit analysis" },
      { property: "og:description", content: "Requirements, verified matches, honest gaps and a first-30-days plan from a single evidence source." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ReportRoute,
});

function ReportRoute() {
  const { id } = Route.useParams();
  return <ReportPage id={id} />;
}