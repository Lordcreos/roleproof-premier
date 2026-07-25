import { createFileRoute } from "@tanstack/react-router";
import { AccountSettingsPage } from "../pages/AccountSettingsPage";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "Account settings — RoleProof" },
      { name: "description", content: "Manage your RoleProof account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountSettingsPage,
});