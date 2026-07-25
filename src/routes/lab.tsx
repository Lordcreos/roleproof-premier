import { createFileRoute } from "@tanstack/react-router";
import { JobMatchLabPage } from "../pages/JobMatchLabPage";

export const Route = createFileRoute("/lab")({
  head: () => ({
    meta: [
      { title: "Job Match Lab — generate a RoleProof analysis" },
      { name: "description", content: "Paste a job description and generate an evidence-backed fit analysis: mapped requirements, verified matches, honest gaps and a 30-day plan." },
      { property: "og:title", content: "Job Match Lab — generate a RoleProof analysis" },
      { property: "og:description", content: "Paste a job description and get evidence-backed matches, gaps and a 30-day plan in one report." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JobMatchLabPage,
});