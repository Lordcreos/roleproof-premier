import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Briefcase,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  User,
  X,
} from "lucide-react";
import { useAuth } from "../../lib/auth";
import { getInitials } from "../../lib/utils";
import { cn } from "../../lib/utils";

const nav = [
  { to: "/app/dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/applications" as const, label: "Applications", icon: Briefcase },
  { to: "/leonardo-sanchez" as const, label: "Evidence profile", icon: User },
  { to: "/app/settings" as const, label: "Settings", icon: Settings },
];

export function ProductShell({ children }: { children: ReactNode }) {
  const { account, signOut } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const initials = account ? getInitials(account.name || account.email) : "RP";

  const handleSignOut = () => {
    signOut();
    navigate({ to: "/" });
  };

  return (
    <div className="product-shell">
      <a className="skip-link" href="#app-main">Skip to main content</a>
      <aside className={cn("product-sidebar", menuOpen && "is-open")} aria-label="Product navigation">
        <div className="sidebar-head">
          <Link className="brand" to="/app/dashboard">
            <span className="brand-mark">R</span>
            <span>RoleProof</span>
          </Link>
          <button
            type="button"
            className="menu-button sidebar-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>
        <Link className="sidebar-cta" to="/lab">
          <Plus size={16} /> New RoleProof
        </Link>
        <nav className="sidebar-nav">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} activeProps={{ className: "active" }}>
              <Icon size={16} aria-hidden /> <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-foot">
          <p className="eyebrow">Berlin · MVP</p>
          <p>Evidence, not application theatre.</p>
        </div>
      </aside>

      <div className="product-main">
        <header className="product-topbar">
          <button
            type="button"
            className="menu-button"
            aria-label="Open navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={22} />
          </button>
          <div className="topbar-search" aria-hidden>
            <Search size={14} />
            <span>Search applications, evidence…</span>
          </div>
          <div className="topbar-right">
            <Link className="button button-small" to="/lab">
              <Plus size={14} /> New RoleProof
            </Link>
            <div className="account-menu">
              <button
                type="button"
                onClick={() => setAccountOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={accountOpen}
              >
                <span className="avatar">{initials}</span>
                <span className="account-name">{account?.name ?? "Account"}</span>
                <ChevronDown size={14} aria-hidden />
              </button>
              {accountOpen ? (
                <div className="account-pop" role="menu">
                  <p className="account-email">{account?.email}</p>
                  <Link role="menuitem" to="/app/settings">Account settings</Link>
                  <Link role="menuitem" to="/leonardo-sanchez">Evidence profile</Link>
                  <button role="menuitem" type="button" onClick={handleSignOut}>
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>
        {menuOpen ? (
          <button
            type="button"
            className="sidebar-scrim"
            aria-label="Close navigation"
            onClick={() => setMenuOpen(false)}
          />
        ) : null}
        <main id="app-main" tabIndex={-1} className="product-content">
          {children}
        </main>
      </div>
    </div>
  );
}