import { createFileRoute } from "@tanstack/react-router";
import { OnboardingPage } from "../pages/OnboardingPage";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Set up your workspace — RoleProof" },
      { name: "description", content: "A short setup pass before you enter your RoleProof workspace." },
      { property: "og:title", content: "Set up your workspace — RoleProof" },
      { property: "og:description", content: "A short setup pass before you enter your RoleProof workspace." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OnboardingPage,
});