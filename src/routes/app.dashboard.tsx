import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "../pages/DashboardPage";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — RoleProof" },
      { name: "description", content: "Your evidence-backed application workspace." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardPage,
});