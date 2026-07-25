import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Filter, Plus, Trash2 } from "lucide-react";
import {
  STATUS_LABELS,
  STATUS_ORDER,
  deleteApplication,
  listApplications,
  updateApplication,
  type ApplicationRecord,
  type ApplicationStatus,
} from "../lib/applications";
import { useHydrated } from "../lib/use-hydrated";
import { Eyebrow, EmptyPanel, LoadingPanel } from "../components/ui/Primitives";
import { formatDate } from "../lib/utils";
import { FitPill } from "../components/shared/FitPill";

export function ApplicationsPage() {
  const hydrated = useHydrated();
  const [tick, setTick] = useState(0);
  const [filter, setFilter] = useState<ApplicationStatus | "all">("all");

  const items = useMemo<ApplicationRecord[]>(() => (hydrated ? listApplications() : []), [hydrated, tick]);
  const filtered = filter === "all" ? items : items.filter((item) => item.status === filter);

  if (!hydrated) return <LoadingPanel title="Loading applications" />;

  const setStatus = (id: string, status: ApplicationStatus) => {
    updateApplication(id, { status });
    setTick((t) => t + 1);
  };
  const remove = (id: string) => {
    if (!window.confirm("Remove this application from your workspace? The report stays available by link.")) return;
    deleteApplication(id);
    setTick((t) => t + 1);
  };

  return (
    <div className="applications-page">
      <header className="page-head">
        <div>
          <Eyebrow>Applications</Eyebrow>
          <h1>Every role you&rsquo;ve run through RoleProof.</h1>
          <p>Track status, revisit the report, and keep your evidence trail in one place.</p>
        </div>
        <Link className="button" to="/lab"><Plus size={16} /> New RoleProof</Link>
      </header>

      <div className="filter-bar" role="tablist" aria-label="Filter by status">
        <span className="filter-label"><Filter size={13} aria-hidden /> Filter</span>
        <button
          role="tab"
          type="button"
          aria-selected={filter === "all"}
          className={filter === "all" ? "chip active" : "chip"}
          onClick={() => setFilter("all")}
        >All · {items.length}</button>
        {STATUS_ORDER.map((status) => {
          const count = items.filter((item) => item.status === status).length;
          return (
            <button
              key={status}
              role="tab"
              type="button"
              aria-selected={filter === status}
              className={filter === status ? "chip active" : "chip"}
              onClick={() => setFilter(status)}
            >{STATUS_LABELS[status]} · {count}</button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <EmptyPanel
          title={items.length === 0 ? "No applications yet" : "Nothing at this status"}
          detail={items.length === 0
            ? "Every RoleProof you generate lands here with fit, gaps and a plan."
            : "Try a different filter — or generate a new RoleProof."}
          action={<Link className="button" to="/lab"><Plus size={16} /> Generate a RoleProof</Link>}
        />
      ) : (
        <div className="app-table" role="table">
          <div className="app-table-head" role="row">
            <span role="columnheader">Role</span>
            <span role="columnheader">Fit</span>
            <span role="columnheader">Status</span>
            <span role="columnheader">Updated</span>
            <span role="columnheader" aria-label="Actions" />
          </div>
          {filtered.map((item) => (
            <div key={item.id} role="row" className="app-table-row">
              <div role="cell" className="app-row-main">
                <Link to="/reports/$id" params={{ id: item.reportId }}>
                  <strong>{item.roleTitle}</strong>
                  <span>{item.companyName}</span>
                </Link>
              </div>
              <div role="cell"><FitPill label={item.fitLabel} /></div>
              <div role="cell">
                <label className="sr-only" htmlFor={`status-${item.id}`}>Status for {item.roleTitle}</label>
                <select
                  id={`status-${item.id}`}
                  className={`status-select status-${item.status}`}
                  value={item.status}
                  onChange={(event) => setStatus(item.id, event.target.value as ApplicationStatus)}
                >
                  {STATUS_ORDER.map((status) => (
                    <option key={status} value={status}>{STATUS_LABELS[status]}</option>
                  ))}
                </select>
              </div>
              <div role="cell"><time dateTime={item.updatedAt}>{formatDate(item.updatedAt)}</time></div>
              <div role="cell" className="row-actions">
                <Link className="text-button" to="/reports/$id" params={{ id: item.reportId }}>Open</Link>
                <button className="icon-button" type="button" aria-label="Remove" onClick={() => remove(item.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}