import { Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "../../lib/utils";

const navItems = [
  { label: "Profile", to: "/leonardo-sanchez" as const },
  { label: "Job Match Lab", to: "/lab" as const },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="nav-wrap">
          <Link className="brand" to="/" aria-label="RoleProof home">
            <span className="brand-mark">R</span>
            <span>RoleProof</span>
          </Link>
          <nav className={cn("nav-links", menuOpen && "is-open")} aria-label="Primary">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                activeProps={{ className: "active" }}
              >
                {item.label}
              </Link>
            ))}
            <Link className="button button-small" to="/lab" onClick={() => setMenuOpen(false)}>
              Generate a RoleProof
            </Link>
          </nav>
          <button
            type="button"
            className="menu-button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <Link className="brand footer-brand" to="/">
              <span className="brand-mark">R</span>
              <span>RoleProof</span>
            </Link>
            <p>Evidence, not application theatre.</p>
          </div>
          <div>
            <p className="eyebrow">Built for real applications</p>
            <p className="muted">Berlin · 2026</p>
          </div>
        </div>
      </footer>
    </div>
  );
}