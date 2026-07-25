import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface AuthAccount {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  onboarded: boolean;
  role?: string;
  goal?: "new-role" | "career-change" | "coach-clients" | "explore";
}

interface AuthState {
  account: AuthAccount | null;
  hydrated: boolean;
  signIn: (email: string, password: string) => Promise<AuthAccount>;
  signUp: (email: string, name: string, password: string) => Promise<AuthAccount>;
  signOut: () => void;
  update: (patch: Partial<AuthAccount>) => void;
}

const KEY_ACCOUNT = "roleproof:auth:account";
const KEY_ACCOUNTS = "roleproof:auth:accounts";

const AuthContext = createContext<AuthState | null>(null);

function loadAccounts(): AuthAccount[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY_ACCOUNTS) ?? "[]") as AuthAccount[];
  } catch {
    return [];
  }
}

function persistAccounts(accounts: AuthAccount[]) {
  localStorage.setItem(KEY_ACCOUNTS, JSON.stringify(accounts));
}

function loadCurrent(): AuthAccount | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY_ACCOUNT);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthAccount;
  } catch {
    return null;
  }
}

function persistCurrent(account: AuthAccount | null) {
  if (account) localStorage.setItem(KEY_ACCOUNT, JSON.stringify(account));
  else localStorage.removeItem(KEY_ACCOUNT);
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function AuthProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<AuthAccount | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setAccount(loadCurrent());
    setHydrated(true);
  }, []);

  const signIn = useCallback(async (email: string, _password: string) => {
    await wait(450);
    const normalized = email.trim().toLowerCase();
    const accounts = loadAccounts();
    let found = accounts.find((a) => a.email === normalized);
    if (!found) {
      // Demo mode: sign-in also seeds the account so returning users can log in
      // with any email they used previously without a real backend.
      found = {
        id: crypto.randomUUID(),
        email: normalized,
        name: normalized.split("@")[0],
        createdAt: new Date().toISOString(),
        onboarded: true,
      };
      persistAccounts([...accounts, found]);
    }
    setAccount(found);
    persistCurrent(found);
    return found;
  }, []);

  const signUp = useCallback(async (email: string, name: string, _password: string) => {
    await wait(600);
    const normalized = email.trim().toLowerCase();
    const accounts = loadAccounts();
    if (accounts.some((a) => a.email === normalized)) {
      throw new Error("An account with that email already exists. Try signing in.");
    }
    const fresh: AuthAccount = {
      id: crypto.randomUUID(),
      email: normalized,
      name: name.trim() || normalized.split("@")[0],
      createdAt: new Date().toISOString(),
      onboarded: false,
    };
    persistAccounts([...accounts, fresh]);
    setAccount(fresh);
    persistCurrent(fresh);
    return fresh;
  }, []);

  const signOut = useCallback(() => {
    setAccount(null);
    persistCurrent(null);
  }, []);

  const update = useCallback((patch: Partial<AuthAccount>) => {
    setAccount((current) => {
      if (!current) return current;
      const merged = { ...current, ...patch };
      persistCurrent(merged);
      const accounts = loadAccounts().map((a) => (a.id === merged.id ? merged : a));
      persistAccounts(accounts);
      return merged;
    });
  }, []);

  const value = useMemo<AuthState>(
    () => ({ account, hydrated, signIn, signUp, signOut, update }),
    [account, hydrated, signIn, signUp, signOut, update],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}