import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "../pages/LandingPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RoleProof — Don't tell recruiters you're a fit. Prove it." },
      { name: "description", content: "Turn real experience into a role-specific portfolio, honest fit analysis, first-30-days plan and cover letter. Every claim traces back to a verified project, experience or education record." },
      { property: "og:title", content: "RoleProof — Prove you're a fit, don't just claim it." },
      { property: "og:description", content: "Evidence-backed job applications: verified matches, honest gaps, interview prep and a first-30-days plan from one source." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});
