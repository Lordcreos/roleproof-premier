import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "../pages/LoginPage";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — RoleProof" },
      { name: "description", content: "Sign in or create your RoleProof workspace." },
      { property: "og:title", content: "Sign in — RoleProof" },
      { property: "og:description", content: "Sign in or create your RoleProof workspace." },
      { name: "robots", content: "noindex" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    mode: search.mode === "signup" ? ("signup" as const) : ("signin" as const),
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  component: LoginPage,
});