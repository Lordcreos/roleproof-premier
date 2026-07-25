import type { RoleProofReport } from "../types/domain";

export type ApplicationStatus =
  | "draft"
  | "applied"
  | "interviewing"
  | "offer"
  | "rejected"
  | "archived";

export interface ApplicationRecord {
  id: string;
  reportId: string;
  companyName: string;
  roleTitle: string;
  companyUrl?: string;
  fitLabel: RoleProofReport["fitLabel"];
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  ownerId?: string;
  note?: string;
}

const KEY = "roleproof:applications";

const hasWindow = () => typeof window !== "undefined";

export function listApplications(): ApplicationRecord[] {
  if (!hasWindow()) return [];
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as ApplicationRecord[]) : [];
    return parsed.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  } catch {
    return [];
  }
}

function writeAll(items: ApplicationRecord[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function upsertApplicationFromReport(report: RoleProofReport, ownerId?: string) {
  if (!hasWindow()) return;
  const items = listApplications();
  const existing = items.find((item) => item.reportId === report.id);
  const now = new Date().toISOString();
  if (existing) {
    Object.assign(existing, {
      fitLabel: report.fitLabel,
      companyName: report.companyName,
      roleTitle: report.roleTitle,
      companyUrl: report.companyUrl,
      updatedAt: now,
    });
    writeAll(items);
    return existing;
  }
  const record: ApplicationRecord = {
    id: crypto.randomUUID(),
    reportId: report.id,
    companyName: report.companyName,
    roleTitle: report.roleTitle,
    companyUrl: report.companyUrl,
    fitLabel: report.fitLabel,
    status: "draft",
    createdAt: now,
    updatedAt: now,
    ownerId,
  };
  writeAll([record, ...items]);
  return record;
}

export function updateApplication(id: string, patch: Partial<ApplicationRecord>) {
  if (!hasWindow()) return;
  const items = listApplications();
  const idx = items.findIndex((item) => item.id === id);
  if (idx === -1) return;
  items[idx] = { ...items[idx], ...patch, updatedAt: new Date().toISOString() };
  writeAll(items);
  return items[idx];
}

export function deleteApplication(id: string) {
  if (!hasWindow()) return;
  writeAll(listApplications().filter((item) => item.id !== id));
}

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  draft: "Draft",
  applied: "Applied",
  interviewing: "Interviewing",
  offer: "Offer",
  rejected: "Closed",
  archived: "Archived",
};

export const STATUS_ORDER: ApplicationStatus[] = [
  "draft",
  "applied",
  "interviewing",
  "offer",
  "rejected",
  "archived",
];