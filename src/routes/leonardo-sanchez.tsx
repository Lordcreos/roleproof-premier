import { createFileRoute } from "@tanstack/react-router";
import { CandidateProfilePage } from "../pages/CandidateProfilePage";

export const Route = createFileRoute("/leonardo-sanchez")({
  head: () => ({
    meta: [
      { title: "Leonardo Sánchez — verified candidate profile · RoleProof" },
      { name: "description", content: "Frontend & full-stack product engineer based in the Potsdam/Berlin area. Verified projects, experience and education used as the source of every RoleProof analysis." },
      { property: "og:title", content: "Leonardo Sánchez — verified candidate profile · RoleProof" },
      { property: "og:description", content: "Frontend & full-stack product engineer with verified projects across React, Next.js, NestJS and applied AI." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CandidateProfilePage,
});