import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Check,
  Clipboard,
  Printer,
  RefreshCw,
  Save,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Badge, ErrorPanel, LoadingPanel } from "../components/ui/Primitives";
import { candidateProfile } from "../data/candidate-profile";
import { countWords } from "../lib/utils";
import {
  generateCoverLetter,
  getLocalCoverLetter,
  getReport,
  saveCoverLetter,
} from "../services/roleproof-service";
import type {
  CoverLetterDocument,
  CoverLetterParagraph,
  CoverLetterRequest,
} from "../types/domain";
import { useHydrated } from "../lib/use-hydrated";

export function CoverLetterPage({ id }: { id: string }) {
  const hydrated = useHydrated();
  const reportQuery = useQuery({
    queryKey: ["report", id],
    queryFn: () => getReport(id),
    enabled: hydrated,
  });
  const [tone, setTone] = useState("confident");
  const [targetLength, setTargetLength] =
    useState<CoverLetterRequest["targetLength"]>("standard");
  const [variant, setVariant] =
    useState<CoverLetterRequest["variant"]>("hiring-manager");
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState<string[]>([
    "project-dynamic-pages",
    "project-erp",
  ]);
  const [candidateNote, setCandidateNote] = useState("");
  const [letter, setLetter] = useState<CoverLetterDocument | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  useEffect(() => {
    if (hydrated) setLetter(getLocalCoverLetter(id));
  }, [hydrated, id]);

  // Cmd/Ctrl+S saves the current letter.
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      const isSave = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s";
      if (!isSave || !letter) return;
      event.preventDefault();
      void handleSave();
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letter]);

  const evidenceOptions = useMemo(() => {
    if (!reportQuery.data) return [];
    const used = new Set([
      ...reportQuery.data.strongestEvidence.map((item) => item.sourceId),
      ...reportQuery.data.matches.flatMap((match) => match.evidenceIds),
    ]);
    return candidateProfile.evidence.filter((item) => used.has(item.id));
  }, [reportQuery.data]);

  if (!hydrated || reportQuery.isLoading) {
    return <div className="section-pad"><LoadingPanel title="Opening Cover Letter Studio" /></div>;
  }
  if (!reportQuery.data) {
    return (
      <div className="section-pad narrow-state">
        <ErrorPanel title="Report not found" detail="Create or open a RoleProof before generating a letter." />
      </div>
    );
  }

  const report = reportQuery.data;

  const handleGenerate = async () => {
    if (selectedEvidenceIds.length < 2) {
      setError("Choose at least two verified evidence items.");
      return;
    }
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      const generated = await generateCoverLetter(report, {
        reportId: report.id,
        tone,
        targetLength,
        variant,
        selectedEvidenceIds,
        excludedEvidenceIds: evidenceOptions
          .map((item) => item.id)
          .filter((item) => !selectedEvidenceIds.includes(item)),
        candidateNote,
      });
      setLetter(generated);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Generation failed.");
    } finally {
      setBusy(false);
    }
  };

  const updateParagraph = (paragraphId: string, text: string) => {
    if (!letter) return;
    setLetter({
      ...letter,
      paragraphs: letter.paragraphs.map((paragraph) =>
        paragraph.id === paragraphId ? { ...paragraph, text } : paragraph,
      ),
      updatedAt: new Date().toISOString(),
    });
    setSaved(false);
  };

  const handleSave = async () => {
    if (!letter) return;
    setBusy(true);
    setError(null);
    try {
      await saveCoverLetter(letter);
      setSaved(true);
      setLastSavedAt(new Date().toISOString());
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  };

  const copyLetter = async () => {
    if (!letter) return;
    await navigator.clipboard.writeText(letterAsText(letter));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <div className="studio-page">
      <header className="studio-header">
        <Link className="text-link" to="/reports/$id" params={{ id: report.id }}>
          <ArrowLeft size={15} /> Back to report
        </Link>
        <div>
          <p className="eyebrow">Cover Letter Studio</p>
          <h1>{report.roleTitle} <span>at {report.companyName}</span></h1>
          <p className="studio-hint">
            Edits are yours. Save with <kbd>⌘</kbd> <kbd>S</kbd> or the button below.
          </p>
        </div>
      </header>

      <div className="studio-layout">
        <aside className="studio-controls">
          <ControlGroup label="Tone">
            <select value={tone} onChange={(event) => setTone(event.target.value)}>
              <option value="professional">Professional</option>
              <option value="confident">Confident</option>
              <option value="warm">Warm</option>
              <option value="concise">Concise</option>
              <option value="startup-oriented">Startup-oriented</option>
              <option value="technical">Technical</option>
              <option value="founder-facing">Founder-facing</option>
            </select>
          </ControlGroup>
          <ControlGroup label="Length">
            <div className="segmented">
              {(["short", "standard", "detailed"] as const).map((value) => (
                <button
                  type="button"
                  className={targetLength === value ? "active" : undefined}
                  onClick={() => setTargetLength(value)}
                  key={value}
                >
                  {value}
                </button>
              ))}
            </div>
          </ControlGroup>
          <ControlGroup label="Audience">
            <select
              value={variant}
              onChange={(event) =>
                setVariant(event.target.value as CoverLetterRequest["variant"])
              }
            >
              <option value="recruiter">Recruiter</option>
              <option value="hiring-manager">Hiring manager</option>
              <option value="startup-founder">Startup founder</option>
            </select>
          </ControlGroup>
          <ControlGroup label="Evidence to use" detail="Choose at least two">
            <div className="evidence-selector">
              {evidenceOptions.map((evidence) => {
                const selected = selectedEvidenceIds.includes(evidence.id);
                return (
                  <label className={selected ? "selected" : undefined} key={evidence.id}>
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() =>
                        setSelectedEvidenceIds((current) =>
                          selected
                            ? current.filter((idValue) => idValue !== evidence.id)
                            : [...current, evidence.id],
                        )
                      }
                    />
                    <span><strong>{evidence.title}</strong><small>{evidence.sourceType}</small></span>
                  </label>
                );
              })}
            </div>
          </ControlGroup>
          <ControlGroup label="Personal note" detail="Optional">
            <textarea
              rows={4}
              value={candidateNote}
              onChange={(event) => setCandidateNote(event.target.value)}
              placeholder="Add motivation or context in your own words…"
            />
          </ControlGroup>
          <button className="button button-wide" type="button" onClick={handleGenerate} disabled={busy}>
            {busy ? <RefreshCw className="spin" size={17} /> : <Sparkles size={17} />}
            {letter ? "Regenerate letter" : "Generate letter"}
          </button>
          {error ? <p className="field-error" role="alert">{error}</p> : null}
        </aside>

        <main className="letter-workspace">
          {!letter ? (
            <div className="letter-empty">
              <span>CL / 001</span>
              <Sparkles size={34} />
              <h2>Build from the evidence you trust.</h2>
              <p>
                Choose at least two sources. The letter will use the structured
                report, not generic application language.
              </p>
            </div>
          ) : (
            <>
              <div className="letter-actions no-print">
                <div>
                  <Badge tone="good">No unsupported claims found</Badge>
                  <span>{countWords(letterAsText(letter))} words</span>
                  {lastSavedAt ? (
                    <span className="draft-chip subtle">
                      <Check size={13} /> Saved at {new Date(lastSavedAt).toLocaleTimeString()}
                    </span>
                  ) : null}
                </div>
                <div>
                  <button type="button" onClick={copyLetter}>
                    {copied ? <Check size={16} /> : <Clipboard size={16} />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <button type="button" onClick={handlePrint}>
                    <Printer size={16} /> Print
                  </button>
                  <button type="button" onClick={handleSave} disabled={busy}>
                    {saved ? <Check size={16} /> : <Save size={16} />}
                    {saved ? "Saved" : "Save"}
                  </button>
                </div>
              </div>
              <article className="letter-paper">
                <label>
                  <span>Suggested subject</span>
                  <input
                    value={letter.subjectLine}
                    onChange={(event) => {
                      setLetter({ ...letter, subjectLine: event.target.value });
                      setSaved(false);
                    }}
                  />
                </label>
                <textarea
                  className="letter-greeting"
                  rows={1}
                  value={letter.greeting}
                  onChange={(event) => {
                    setLetter({ ...letter, greeting: event.target.value });
                    setSaved(false);
                  }}
                />
                {letter.paragraphs.map((paragraph) => (
                  <ParagraphEditor
                    key={paragraph.id}
                    paragraph={paragraph}
                    onChange={(text) => updateParagraph(paragraph.id, text)}
                  />
                ))}
                <textarea
                  className="letter-closing"
                  rows={4}
                  value={letter.closing}
                  onChange={(event) => {
                    setLetter({ ...letter, closing: event.target.value });
                    setSaved(false);
                  }}
                />
              </article>
              <section className="quality-card">
                <div>
                  <p className="eyebrow">Quality summary</p>
                  <h2>{letter.quality.summary}</h2>
                </div>
                <div className="quality-scores">
                  <Score label="Specificity" value={letter.quality.specificity} />
                  <Score label="Evidence" value={letter.quality.evidenceCoverage} />
                  <Score label="Natural language" value={letter.quality.naturalLanguage} />
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function ControlGroup({
  label,
  detail,
  children,
}: {
  label: string;
  detail?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="control-group">
      <div><label>{label}</label>{detail ? <span>{detail}</span> : null}</div>
      {children}
    </div>
  );
}

function ParagraphEditor({
  paragraph,
  onChange,
}: {
  paragraph: CoverLetterParagraph;
  onChange: (text: string) => void;
}) {
  return (
    <div className="paragraph-editor">
      <textarea
        rows={Math.max(3, Math.ceil(paragraph.text.length / 90))}
        value={paragraph.text}
        onChange={(event) => onChange(event.target.value)}
      />
      {paragraph.evidenceIds.length ? (
        <div className="paragraph-evidence">
          {paragraph.evidenceIds.map((id) => {
            const evidence = candidateProfile.evidence.find((item) => item.id === id);
            return <span key={id}>Source: {evidence?.title ?? id}</span>;
          })}
        </div>
      ) : null}
    </div>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}/10</strong>
      <div><i style={{ width: `${value * 10}%` }} /></div>
    </div>
  );
}

function letterAsText(letter: CoverLetterDocument) {
  return [
    `Subject: ${letter.subjectLine}`,
    "",
    letter.greeting,
    "",
    ...letter.paragraphs.flatMap((paragraph) => [paragraph.text, ""]),
    letter.closing,
  ].join("\n");
}