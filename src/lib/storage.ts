import type { CoverLetterDocument, JobAnalysisInput, RoleProofReport } from "../types/domain";
import { roleProofReportSchema } from "../schemas/domain";

const REPORT_PREFIX = "roleproof:report:";
const LETTER_PREFIX = "roleproof:letter:";
const DRAFT_KEY = "roleproof:job-draft";

const hasWindow = () => typeof window !== "undefined";

export function saveReportLocally(report: RoleProofReport) {
  if (!hasWindow()) return;
  localStorage.setItem(`${REPORT_PREFIX}${report.id}`, JSON.stringify(report));
  localStorage.setItem(`${REPORT_PREFIX}latest`, report.id);
}

export function readReportLocally(id: string) {
  if (!hasWindow()) return null;
  const resolvedId =
    id === "latest" ? localStorage.getItem(`${REPORT_PREFIX}latest`) : id;
  if (!resolvedId) return null;
  const raw = localStorage.getItem(`${REPORT_PREFIX}${resolvedId}`);
  if (!raw) return null;
  try {
    return roleProofReportSchema.parse(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function readPublicReportLocally(slug: string) {
  if (!hasWindow()) return null;
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key?.startsWith(REPORT_PREFIX) || key.endsWith("latest")) continue;
    const raw = localStorage.getItem(key);
    if (!raw) continue;
    try {
      const report = roleProofReportSchema.parse(JSON.parse(raw));
      if (report.publicSlug === slug && report.isPublic) return report;
    } catch {
      // Ignore stale local demo data.
    }
  }
  return null;
}

export function saveLetterLocally(letter: CoverLetterDocument) {
  if (!hasWindow()) return;
  localStorage.setItem(`${LETTER_PREFIX}${letter.reportId}`, JSON.stringify(letter));
}

export function readLetterLocally(reportId: string): CoverLetterDocument | null {
  if (!hasWindow()) return null;
  const raw = localStorage.getItem(`${LETTER_PREFIX}${reportId}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CoverLetterDocument;
  } catch {
    return null;
  }
}

export function saveJobDraft(input: Partial<JobAnalysisInput>) {
  if (!hasWindow()) return;
  localStorage.setItem(DRAFT_KEY, JSON.stringify(input));
}

export function readJobDraft(): Partial<JobAnalysisInput> {
  if (!hasWindow()) return {};
  const raw = localStorage.getItem(DRAFT_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Partial<JobAnalysisInput>;
  } catch {
    return {};
  }
}

export function useHydrated() {
  // Deliberately minimal; used to gate localStorage reads that would
  // otherwise cause hydration mismatches under SSR.
  const [hydrated, setHydrated] = require("react").useState(false);
  require("react").useEffect(() => setHydrated(true), []);
  return hydrated as boolean;
}