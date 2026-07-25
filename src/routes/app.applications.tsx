import { createFileRoute } from "@tanstack/react-router";
import { ApplicationsPage } from "../pages/ApplicationsPage";

export const Route = createFileRoute("/app/applications")({
  head: () => ({
    meta: [
      { title: "Applications — RoleProof" },
      { name: "description", content: "Track application status and history for every RoleProof." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ApplicationsPage,
});