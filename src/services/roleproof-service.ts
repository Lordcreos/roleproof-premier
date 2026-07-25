import { candidateProfile } from "../data/candidate-profile";
import { buildDemoCoverLetter, buildDemoReport } from "../data/demo-report";
import { isDemoMode, supabase } from "../lib/supabase";
import {
  readLetterLocally,
  readPublicReportLocally,
  readReportLocally,
  saveLetterLocally,
  saveReportLocally,
} from "../lib/storage";
import { upsertApplicationFromReport } from "../lib/applications";
import { roleProofReportSchema } from "../schemas/domain";
import type {
  CoverLetterDocument,
  CoverLetterRequest,
  JobAnalysisInput,
  RoleProofReport,
} from "../types/domain";

function functionError(message: string, cause?: unknown) {
  const error = new Error(message);
  if (cause) Object.assign(error, { cause });
  return error;
}

export async function analyzeRole(input: JobAnalysisInput) {
  if (isDemoMode || !supabase) {
    const report = await buildDemoReport(input);
    saveReportLocally(report);
    upsertApplicationFromReport(report);
    return report;
  }

  const { data, error } = await supabase.functions.invoke("analyze-role", {
    body: { ...input, candidateId: candidateProfile.id },
  });
  if (error) throw functionError("The analysis could not be completed.", error);
  const report = roleProofReportSchema.parse({
    ...data.report,
    accessToken: data.accessToken,
  });
  saveReportLocally(report);
  upsertApplicationFromReport(report);
  return report;
}

export async function getReport(id: string) {
  const local = readReportLocally(id);
  if (local) return local;

  // Private reports use a capability token stored with the local report.
  // Without that token we deliberately do not fetch by ID alone.
  return null;
}

export async function getPublicReport(slug: string) {
  const local = readPublicReportLocally(slug);
  if (local || isDemoMode || !supabase) return local;

  const { data, error } = await supabase.functions.invoke("report-access", {
    body: { action: "getPublic", publicSlug: slug },
  });
  if (error) return null;
  return roleProofReportSchema.parse(data.report);
}

export async function setReportSharing(report: RoleProofReport, isPublic: boolean) {
  if (isDemoMode || !supabase) {
    const updated = { ...report, isPublic };
    saveReportLocally(updated);
    return updated;
  }

  const { data, error } = await supabase.functions.invoke("report-access", {
    body: {
      action: "setSharing",
      reportId: report.id,
      isPublic,
      accessToken: report.accessToken,
    },
  });
  if (error) throw functionError("Sharing could not be updated.", error);
  const updated = roleProofReportSchema.parse(data.report);
  saveReportLocally(updated);
  return updated;
}

export async function generateCoverLetter(
  report: RoleProofReport,
  request: CoverLetterRequest,
) {
  if (isDemoMode || !supabase) {
    const letter = await buildDemoCoverLetter(report, request);
    saveLetterLocally(letter);
    return letter;
  }

  const { data, error } = await supabase.functions.invoke("generate-cover-letter", {
    body: { ...request, accessToken: report.accessToken },
  });
  if (error) throw functionError("The cover letter could not be generated.", error);
  const letter = data.letter as CoverLetterDocument;
  saveLetterLocally(letter);
  return letter;
}

export async function saveCoverLetter(letter: CoverLetterDocument) {
  saveLetterLocally(letter);
  if (isDemoMode || !supabase) return letter;

  const { error } = await supabase.functions.invoke("save-cover-letter", {
    body: {
      letter,
      accessToken: readReportLocally(letter.reportId)?.accessToken,
    },
  });
  if (error) throw functionError("The edited letter could not be saved.", error);
  return letter;
}

export function getLocalCoverLetter(reportId: string) {
  return readLetterLocally(reportId);
}

export async function submitWaitlist(email: string, source = "landing") {
  if (isDemoMode || !supabase) {
    const key = "roleproof:waitlist";
    const emails = JSON.parse(localStorage.getItem(key) ?? "[]") as string[];
    if (emails.includes(email.toLowerCase())) return { duplicate: true };
    localStorage.setItem(key, JSON.stringify([...emails, email.toLowerCase()]));
    return { duplicate: false };
  }

  const { data, error } = await supabase.functions.invoke("waitlist", {
    body: { email, source },
  });
  if (error) throw functionError("The waitlist signup could not be saved.", error);
  return data as { duplicate: boolean };
}
