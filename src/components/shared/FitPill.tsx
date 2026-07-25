import type { RoleProofReport } from "../../types/domain";

const LABELS: Record<RoleProofReport["fitLabel"], { text: string; tone: string }> = {
  "strong-fit": { text: "Strong fit", tone: "good" },
  "promising-fit": { text: "Promising fit", tone: "accent" },
  "partial-fit": { text: "Partial fit", tone: "warn" },
  "stretch-opportunity": { text: "Stretch", tone: "risk" },
};

export function FitPill({ label }: { label: RoleProofReport["fitLabel"] }) {
  const meta = LABELS[label];
  return <span className={`fit-pill fit-${meta.tone}`}>{meta.text}</span>;
}