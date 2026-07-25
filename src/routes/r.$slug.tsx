import { createFileRoute } from "@tanstack/react-router";
import { PublicReportPage } from "../pages/PublicReportPage";

export const Route = createFileRoute("/r/$slug")({
  head: () => ({
    meta: [
      { title: "Public RoleProof — verified candidate evidence" },
      { name: "description", content: "A public, evidence-backed fit analysis: requirements, verified matches, honest gaps and a first-30-days plan for a real role." },
      { property: "og:title", content: "Public RoleProof — verified candidate evidence" },
      { property: "og:description", content: "Read a candidate's evidence-linked fit for a specific role. Every claim points back to a real project, experience or education record." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PublicRoute,
});

function PublicRoute() {
  const { slug } = Route.useParams();
  return <PublicReportPage slug={slug} />;
}