import { AlertCircle, LoaderCircle } from "lucide-react";
import type { PropsWithChildren, ReactNode } from "react";
import { cn } from "../../lib/utils";

export function Eyebrow({ children }: PropsWithChildren) {
  return <p className="eyebrow">{children}</p>;
}

export function Badge({
  children,
  tone = "neutral",
}: PropsWithChildren<{ tone?: "neutral" | "good" | "warn" | "risk" | "accent" }>) {
  return <span className={cn("badge", `badge-${tone}`)}>{children}</span>;
}

export function SectionHeading({
  eyebrow,
  title,
  detail,
}: {
  eyebrow?: string;
  title: string;
  detail?: string;
}) {
  return (
    <div className="section-heading">
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2>{title}</h2>
      {detail ? <p>{detail}</p> : null}
    </div>
  );
}

export function LoadingPanel({
  title = "Loading",
  detail,
}: {
  title?: string;
  detail?: string;
}) {
  return (
    <div className="state-card" role="status">
      <LoaderCircle className="spin" aria-hidden />
      <div>
        <h2>{title}</h2>
        {detail ? <p>{detail}</p> : null}
      </div>
    </div>
  );
}

export function ErrorPanel({
  title = "Something went wrong",
  detail,
  action,
}: {
  title?: string;
  detail: string;
  action?: ReactNode;
}) {
  return (
    <div className="state-card state-error" role="alert">
      <AlertCircle aria-hidden />
      <div>
        <h2>{title}</h2>
        <p>{detail}</p>
        {action}
      </div>
    </div>
  );
}
