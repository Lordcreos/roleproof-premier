import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { useAuth, type AuthAccount } from "../lib/auth";
import { Eyebrow } from "../components/ui/Primitives";

const goals: Array<{ id: NonNullable<AuthAccount["goal"]>; label: string; text: string }> = [
  { id: "new-role", label: "Land a new role", text: "I&rsquo;m applying and want stronger, evidence-first applications." },
  { id: "career-change", label: "Change direction", text: "I&rsquo;m re-framing my experience for a different kind of role." },
  { id: "coach-clients", label: "Coach candidates", text: "I help others prepare and want a shared, honest workspace." },
  { id: "explore", label: "Just exploring", text: "Curious what an evidence-first application looks like." },
];

export function OnboardingPage() {
  const { account, update } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<0 | 1>(0);
  const [name, setName] = useState(account?.name ?? "");
  const [role, setRole] = useState(account?.role ?? "");
  const [goal, setGoal] = useState<AuthAccount["goal"]>(account?.goal);

  const finish = () => {
    update({ name: name.trim() || account?.name || "", role: role.trim() || undefined, goal, onboarded: true });
    navigate({ to: "/app/dashboard" });
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-inner">
        <Eyebrow>Step {step + 1} of 2</Eyebrow>
        <div className="onboarding-progress" aria-hidden>
          <span style={{ width: `${((step + 1) / 2) * 100}%` }} />
        </div>

        {step === 0 ? (
          <>
            <h1>Set up your workspace.</h1>
            <p className="auth-lede">A short pass so RoleProof can address you and adapt the workspace.</p>
            <div className="onboarding-grid">
              <label className="field">
                <span className="field-label"><span>Full name</span></span>
                <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Leonardo Sánchez" autoFocus />
              </label>
              <label className="field">
                <span className="field-label"><span>Current role or focus</span><small>Optional</small></span>
                <input value={role} onChange={(event) => setRole(event.target.value)} placeholder="AI Product Engineer" />
              </label>
            </div>
            <div className="onboarding-actions">
              <button className="button" type="button" onClick={() => setStep(1)}>
                Continue <ArrowRight size={16} />
              </button>
              <button className="text-button" type="button" onClick={finish}>Skip for now</button>
            </div>
          </>
        ) : (
          <>
            <h1>What&rsquo;s the goal?</h1>
            <p className="auth-lede">We&rsquo;ll surface the parts of the product that match.</p>
            <div className="goal-grid" role="radiogroup" aria-label="Primary goal">
              {goals.map((option) => {
                const selected = goal === option.id;
                return (
                  <button
                    key={option.id}
                    role="radio"
                    aria-checked={selected}
                    type="button"
                    className={selected ? "goal-card selected" : "goal-card"}
                    onClick={() => setGoal(option.id)}
                  >
                    <strong>{option.label}</strong>
                    <span dangerouslySetInnerHTML={{ __html: option.text }} />
                    {selected ? <Check size={16} className="goal-check" /> : null}
                  </button>
                );
              })}
            </div>
            <div className="onboarding-actions">
              <button className="text-button" type="button" onClick={() => setStep(0)}>← Back</button>
              <button className="button" type="button" onClick={finish}>Enter workspace <ArrowRight size={16} /></button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}