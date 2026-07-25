import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function NotFoundPage() {
  return (
    <section className="not-found section-pad">
      <p className="eyebrow">404 / Missing evidence</p>
      <h1>This page can’t support the claim that it exists.</h1>
      <Link className="button" to="/"><ArrowLeft size={17} /> Back to RoleProof</Link>
    </section>
  );
}