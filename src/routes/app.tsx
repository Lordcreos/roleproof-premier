import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "../lib/auth";
import { LoadingPanel } from "../components/ui/Primitives";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex" }],
  }),
  component: AppLayout,
});

function AppLayout() {
  const { account, hydrated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hydrated) return;
    if (!account) {
      navigate({ to: "/login", search: { mode: "signin", redirect: window.location.pathname } });
      return;
    }
    if (!account.onboarded) navigate({ to: "/onboarding" });
  }, [account, hydrated, navigate]);

  if (!hydrated || !account) {
    return (
      <div className="section-pad narrow-state">
        <LoadingPanel title="Opening workspace" detail="Checking your session…" />
      </div>
    );
  }
  return <Outlet />;
}