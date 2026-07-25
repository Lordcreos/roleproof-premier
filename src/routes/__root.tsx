import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AppShell } from "../components/layout/AppShell";
import { ProductShell } from "../components/layout/ProductShell";
import { AuthProvider } from "../lib/auth";
import { NotFoundPage } from "../pages/NotFoundPage";
import { ErrorPanel } from "../components/ui/Primitives";

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="section-pad narrow-state">
      <ErrorPanel
        title="This page didn't load"
        detail="Something went wrong on our end. You can try again or head back home."
        action={
          <div className="hero-actions">
            <button
              type="button"
              className="button"
              onClick={() => {
                router.invalidate();
                reset();
              }}
            >
              Try again
            </button>
            <a className="text-link" href="/">Go home</a>
          </div>
        }
      />
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "RoleProof — Prove you're a fit, don't just claim it." },
      { name: "description", content: "Evidence-backed job applications: verified matches, honest gaps, interview prep and a first-30-days plan from one source." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundPage,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // Public share pages, the login/onboarding flow and the authenticated
  // /app/* product surface each render their own chrome.
  const isPublicShare = pathname.startsWith("/r/");
  const isAuthFlow = pathname === "/login" || pathname === "/onboarding";
  const isProduct = pathname === "/app" || pathname.startsWith("/app/");

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {isPublicShare || isAuthFlow ? (
          <Outlet />
        ) : isProduct ? (
          <ProductShell><Outlet /></ProductShell>
        ) : (
          <AppShell><Outlet /></AppShell>
        )}
      </AuthProvider>
    </QueryClientProvider>
  );
}
