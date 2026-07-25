import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Check, LoaderCircle, LockKeyhole, RotateCcw, Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { Eyebrow, ErrorPanel } from "../components/ui/Primitives";
import { clearJobDraft, readJobDraft, saveJobDraft } from "../lib/storage";
import { isDemoMode } from "../lib/supabase";
import { jobAnalysisInputSchema } from "../schemas/domain";
import { analyzeRole } from "../services/roleproof-service";
import { useHydrated } from "../lib/use-hydrated";

type JobFormValues = z.infer<typeof jobAnalysisInputSchema>;

const progressStages = [
  "Reading the role",
  "Extracting requirements",
  "Matching candidate evidence",
  "Identifying gaps",
  "Building the 30-day plan",
  "Preparing the final report",
];

export function JobMatchLabPage() {
  const navigate = useNavigate();
  const hydrated = useHydrated();
  const [stage, setStage] = useState(-1);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [draftSaved, setDraftSaved] = useState(false);
  const draftTimer = useRef<number | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobAnalysisInputSchema),
    defaultValues: {
      companyName: "",
      roleTitle: "",
      companyUrl: "",
      jobDescription: "",
      language: "en",
      focusArea: "technical-fit",
    },
  });

  useEffect(() => {
    if (!hydrated) return;
    const draft = readJobDraft();
    reset({
      companyName: draft.companyName ?? "",
      roleTitle: draft.roleTitle ?? "",
      companyUrl: draft.companyUrl ?? "",
      jobDescription: draft.jobDescription ?? "",
      language: draft.language ?? "en",
      focusArea: draft.focusArea ?? "technical-fit",
    });
  }, [hydrated, reset]);

  const description = watch("jobDescription") ?? "";
  const descriptionLength = description.length;
  const descriptionMax = 30000;
  const descriptionPct = Math.min(100, Math.round((descriptionLength / descriptionMax) * 100));

  // Auto-save the draft as the user types so a reload doesn't lose input.
  useEffect(() => {
    if (!hydrated) return;
    const subscription = watch((values) => {
      if (draftTimer.current) window.clearTimeout(draftTimer.current);
      draftTimer.current = window.setTimeout(() => {
        saveJobDraft(values as JobFormValues);
        setDraftSaved(true);
        window.setTimeout(() => setDraftSaved(false), 1400);
      }, 400);
    });
    return () => {
      subscription.unsubscribe();
      if (draftTimer.current) window.clearTimeout(draftTimer.current);
    };
  }, [hydrated, watch]);

  const handleClearDraft = () => {
    clearJobDraft();
    reset({
      companyName: "",
      roleTitle: "",
      companyUrl: "",
      jobDescription: "",
      language: "en",
      focusArea: "technical-fit",
    });
  };

  useEffect(() => {
    if (!isSubmitting) return;
    setStage(0);
    const timer = window.setInterval(() => {
      setStage((current) => Math.min(current + 1, progressStages.length - 1));
    }, 500);
    return () => window.clearInterval(timer);
  }, [isSubmitting]);

  const onSubmit = async (values: JobFormValues) => {
    setSubmitError(null);
    saveJobDraft(values);
    try {
      const report = await analyzeRole({
        ...values,
        companyUrl: values.companyUrl || undefined,
      });
      navigate({ to: "/reports/$id", params: { id: report.id } });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Analysis failed. Please try again.");
      setStage(-1);
    }
  };

  return (
    <div className="lab-page section-pad">
      <div className="lab-intro">
        <Eyebrow>Job Match Lab</Eyebrow>
        <h1>Put the role under a microscope.</h1>
        <p>
          We compare the job against Leonardo’s verified evidence. Strong claims
          need a source; missing evidence stays visible.
        </p>
        <div className="lab-assurance">
          <LockKeyhole size={18} />
          <span>Your job description is used only to create this analysis.</span>
        </div>
      </div>

      <form className="job-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-topline">
          <span className="draft-chip" aria-live="polite">
            {draftSaved ? (<><Check size={13} /> Draft saved</>) : (<><Save size={13} /> Auto-saves as you type</>)}
          </span>
          <button
            type="button"
            className="text-button"
            onClick={handleClearDraft}
            disabled={isSubmitting}
          >
            <RotateCcw size={14} /> Clear draft
          </button>
        </div>
        {isDemoMode ? (
          <div className="demo-notice">
            <span>Demo mode</span>
            The complete flow works locally. Connect Supabase to use live AI and sharing.
          </div>
        ) : null}
        <div className="form-grid">
          <Field label="Company name" error={errors.companyName?.message}>
            <input {...register("companyName")} placeholder="Example GmbH" />
          </Field>
          <Field label="Role title" error={errors.roleTitle?.message}>
            <input {...register("roleTitle")} placeholder="AI Product Engineer" />
          </Field>
        </div>
        <Field label="Company URL" hint="Optional" error={errors.companyUrl?.message}>
          <input {...register("companyUrl")} placeholder="https://example.com" type="url" />
        </Field>
        <Field
          label="Job description"
          hint={`${descriptionLength.toLocaleString()} / ${descriptionMax.toLocaleString()} characters`}
          error={errors.jobDescription?.message}
        >
          <textarea
            {...register("jobDescription")}
            rows={13}
            placeholder="Paste the complete job description here…"
          />
          <div className="char-meter" aria-hidden>
            <span style={{ width: `${descriptionPct}%` }} />
          </div>
        </Field>
        <div className="form-grid">
          <Field label="Analysis language" error={errors.language?.message}>
            <select {...register("language")}>
              <option value="en">English</option>
              <option value="de">Deutsch</option>
              <option value="es">Español</option>
            </select>
          </Field>
          <Field label="Focus area" error={errors.focusArea?.message}>
            <select {...register("focusArea")}>
              <option value="technical-fit">Technical fit</option>
              <option value="product-fit">Product fit</option>
              <option value="startup-fit">Startup fit</option>
              <option value="leadership-potential">Leadership potential</option>
              <option value="ai-experience">AI experience</option>
            </select>
          </Field>
        </div>

        {submitError ? (
          <ErrorPanel
            title="The analysis stopped"
            detail={`${submitError} Your input is still here.`}
          />
        ) : null}

        {isSubmitting ? (
          <div className="analysis-progress" role="status" aria-live="polite" aria-busy="true">
            <div className="progress-head">
              <LoaderCircle className="spin" aria-hidden />
              <div>
                <strong>Building your RoleProof</strong>
                <span>{progressStages[stage] ?? progressStages[0]}</span>
              </div>
            </div>
            <div className="progress-bar" aria-hidden>
              <span
                style={{
                  width: `${Math.round(((Math.max(stage, 0) + 1) / progressStages.length) * 100)}%`,
                }}
              />
            </div>
            <ol>
              {progressStages.map((item, index) => (
                <li className={index <= stage ? "done" : undefined} key={item}>
                  <span>{index < stage ? <Check size={13} /> : index + 1}</span>{item}
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <button className="button button-wide" type="submit" aria-busy={isSubmitting}>
            Generate my RoleProof <ArrowRight size={18} />
          </button>
        )}
      </form>
    </div>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="field">
      <span className="field-label">
        <span>{label}</span>
        {hint ? <small>{hint}</small> : null}
      </span>
      {children}
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}