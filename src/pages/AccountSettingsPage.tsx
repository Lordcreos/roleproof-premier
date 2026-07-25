import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../lib/auth";
import { Eyebrow } from "../components/ui/Primitives";

export function AccountSettingsPage() {
  const { account, update, signOut } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(account?.name ?? "");
  const [role, setRole] = useState(account?.role ?? "");
  const [saved, setSaved] = useState(false);

  if (!account) return null;

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    update({ name: name.trim() || account.name, role: role.trim() || undefined });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1400);
  };

  const handleSignOut = () => { signOut(); navigate({ to: "/" }); };

  return (
    <div className="settings-page">
      <header className="page-head">
        <div>
          <Eyebrow>Settings</Eyebrow>
          <h1>Account</h1>
          <p>Simple profile info that shapes your workspace. No third-party data is shared.</p>
        </div>
      </header>

      <form className="settings-form" onSubmit={save}>
        <label className="field">
          <span className="field-label"><span>Full name</span></span>
          <input value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label className="field">
          <span className="field-label"><span>Email</span><small>Read-only in demo</small></span>
          <input value={account.email} readOnly />
        </label>
        <label className="field">
          <span className="field-label"><span>Current role or focus</span><small>Optional</small></span>
          <input value={role} onChange={(event) => setRole(event.target.value)} />
        </label>

        <div className="settings-actions">
          <button className="button" type="submit">{saved ? "Saved" : "Save changes"}</button>
          <button className="text-button danger" type="button" onClick={handleSignOut}>Sign out</button>
        </div>
      </form>
    </div>
  );
}