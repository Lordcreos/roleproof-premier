import {
  ArrowRight,
  Check,
  FileCheck2,
  Layers,
  Link2,
  Rocket,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Badge, Eyebrow, SectionHeading } from "../components/ui/Primitives";
import { WaitlistForm } from "../components/shared/WaitlistForm";

const steps = [
  { number: "01", title: "Add the role", text: "Paste the job description and the small amount of company context you actually know." },
  { number: "02", title: "Match real evidence", text: "RoleProof maps requirements to verified projects, experience and education." },
  { number: "03", title: "See strengths and gaps", text: "Strong matches are explained. Missing or unclear areas stay visible." },
  { number: "04", title: "Share the proof", text: "Create a public report and an evidence-backed cover letter from one source." },
];

const plans = [
  { name: "Free", price: "$0", items: ["1 public profile", "3 analyses / month", "Shareable reports"] },
  { name: "Pro", price: "$15", featured: true, items: ["Unlimited analyses", "Cover Letter Studio", "Report variants"] },
  { name: "Career Coach", price: "$99", items: ["Up to 20 candidates", "Shared workspace", "Reusable templates"] },
];

const audiences = [
  {
    icon: Rocket,
    label: "Job seekers",
    text: "Apply with proof, not adjectives. Every claim is linked back to work you actually did.",
  },
  {
    icon: Users,
    label: "Career coaches",
    text: "Show clients where the evidence is thin and where a concrete story already exists.",
  },
  {
    icon: Layers,
    label: "Small hiring teams",
    text: "Read a report that separates verified work from generic application text.",
  },
];

const proofStrip = [
  { value: "8 sources", label: "Verified evidence graph" },
  { value: "6 stages", label: "Requirements → 30-day plan" },
  { value: "0", label: "Invented achievements" },
];

export function LandingPage() {
  return (
    <>
      <section className="hero section-pad">
        <div className="hero-copy">
          <Eyebrow>Evidence-backed applications</Eyebrow>
          <h1>
            Don’t tell recruiters
            <br />
            you’re a fit. <em>Prove it.</em>
          </h1>
          <p className="hero-lede">
            Turn real experience into a role-specific portfolio, honest fit analysis,
            first-30-days plan and cover letter.
          </p>
          <div className="hero-actions">
            <Link className="button" to="/lab">
              Generate a RoleProof <ArrowRight size={18} />
            </Link>
            <Link className="text-link" to="/leonardo-sanchez">
              View Leonardo’s profile
            </Link>
          </div>
          <div className="trust-row">
            <span><ShieldCheck size={16} /> No invented achievements</span>
            <span><Link2 size={16} /> Traceable evidence</span>
          </div>
        </div>
        <Link
          className="hero-report"
          to="/lab"
          aria-label="Generate a RoleProof like this example"
        >
          <div className="paper-top">
            <span className="mini-brand">RP / 001</span>
            <Badge tone="good">Promising fit</Badge>
          </div>
          <p className="report-company">AI Product Engineer · Example GmbH</p>
          <h2>Leonardo has direct evidence for the role’s product engineering core.</h2>
          <div className="proof-line">
            <span className="proof-index">E1</span>
            <div>
              <strong>Configuration-driven React systems</strong>
              <p>Dynamic Pages Platform · High confidence</p>
            </div>
          </div>
          <div className="proof-line">
            <span className="proof-index">E2</span>
            <div>
              <strong>Full-stack operational workflows</strong>
              <p>ERP Platform · High confidence</p>
            </div>
          </div>
          <div className="gap-preview">
            <SearchCheck size={18} />
            <p><strong>Honest gap:</strong> exact company-domain depth is unverified.</p>
          </div>
        </Link>
      </section>

      <section className="ticker" aria-label="Product principles">
        <span>Verified evidence</span><span>•</span><span>Honest gaps</span><span>•</span>
        <span>Role-specific plans</span><span>•</span><span>Shareable proof</span>
      </section>

      <section className="proof-strip" aria-label="What sits behind every RoleProof">
        {proofStrip.map((item) => (
          <div key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </section>

      <section className="section-pad">
        <SectionHeading
          eyebrow="The workflow"
          title="One evidence graph. Every application asset."
          detail="The report and letter come from the same verified source, so the story stays specific and defensible."
        />
        <div className="steps-grid">
          {steps.map((step) => (
            <article className="step-card" key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
        <div className="workflow-cta">
          <Link className="button" to="/lab">
            Start with a real role <ArrowRight size={18} />
          </Link>
          <Link className="text-link" to="/leonardo-sanchez">See the source profile</Link>
        </div>
      </section>

      <section className="contrast-section">
        <div className="section-pad contrast-grid">
          <div>
            <Eyebrow>Built differently</Eyebrow>
            <h2>Generic text is cheap. Credible evidence is useful.</h2>
          </div>
          <div className="comparison-list">
            <div><Sparkles /><p><strong>Most tools:</strong> polished claims without a visible source.</p></div>
            <div><FileCheck2 /><p><strong>RoleProof:</strong> claims linked to a project, experience or education record.</p></div>
            <div><ShieldCheck /><p><strong>RoleProof:</strong> gaps remain gaps, with a practical interview plan.</p></div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <SectionHeading
          eyebrow="Who it’s for"
          title="Written for people who actually want the role."
        />
        <div className="audience-grid">
          {audiences.map(({ icon: Icon, label, text }) => (
            <article className="audience-card" key={label}>
              <Icon aria-hidden />
              <h3>{label}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-pad">
        <SectionHeading
          eyebrow="Pricing preview"
          title="Start with the proof you already have."
          detail="Payments are not enabled during the MVP."
        />
        <div className="pricing-grid">
          {plans.map((plan) => (
            <article className={plan.featured ? "price-card featured" : "price-card"} key={plan.name}>
              {plan.featured ? <Badge tone="accent">Most useful</Badge> : null}
              <p className="plan-name">{plan.name}</p>
              <p className="plan-price">{plan.price}<small>/month</small></p>
              <ul>
                {plan.items.map((item) => <li key={item}><Check size={16} />{item}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="waitlist-section" id="waitlist">
        <div>
          <Eyebrow>Early access</Eyebrow>
          <h2>Make the next application easier to believe.</h2>
          <p>Join the short list for product updates and private testing.</p>
        </div>
        <WaitlistForm />
      </section>
    </>
  );
}