import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowRight, LoaderCircle, ShieldCheck } from "lucide-react";
import { z } from "zod";
import { useAuth } from "../lib/auth";
import { Eyebrow, ErrorPanel } from "../components/ui/Primitives";

const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email."),
  password: z.string().min(6, "At least 6 characters."),
});
const signUpSchema = signInSchema.extend({
  name: z.string().trim().min(2, "Tell us what to call you."),
});

type Mode = "signin" | "signup";

export function LoginPage() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { mode?: Mode; redirect?: string };
  const initialMode: Mode = search.mode === "signup" ? "signup" : "signin";
  const [mode, setMode] = useState<Mode>(initialMode);
  const [error, setError] = useState<string | null>(null);

  const isSignup = mode === "signup";
  const form = useForm<{ email: string; password: string; name?: string }>({
    resolver: zodResolver(isSignup ? signUpSchema : signInSchema),
    defaultValues: { email: "", password: "", name: "" },
  });

  const submit = form.handleSubmit(async (values) => {
    setError(null);
    try {
      const account = isSignup
        ? await signUp(values.email, values.name ?? "", values.password)
        : await signIn(values.email, values.password);
      const target = search.redirect || (account.onboarded ? "/app/dashboard" : "/onboarding");
      navigate({ to: target });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    }
  });

  return (
    <div className="auth-page">
      <aside className="auth-aside" aria-hidden>
        <Link className="brand" to="/">
          <span className="brand-mark">R</span>
          <span>RoleProof</span>
        </Link>
        <div className="auth-quote">
          <Eyebrow>Berlin · Career SaaS</Eyebrow>
          <p>
            <em>&ldquo;Don&rsquo;t tell recruiters you&rsquo;re a fit. Prove it.&rdquo;</em>
          </p>
          <ul>
            <li><ShieldCheck size={14} /> Every claim traces back to real work.</li>
            <li><ShieldCheck size={14} /> Honest gaps stay visible.</li>
            <li><ShieldCheck size={14} /> Reports, letters and 30-day plans from one source.</li>
          </ul>
        </div>
      </aside>

      <section className="auth-panel">
        <div className="auth-inner">
          <Eyebrow>{isSignup ? "Create account" : "Welcome back"}</Eyebrow>
          <h1>{isSignup ? "Start with the proof you already have." : "Sign in to RoleProof."}</h1>
          <p className="auth-lede">
            {isSignup
              ? "Two fields and you’re in. Demo accounts live in your browser—no email is sent."
              : "Use any email you’ve signed up with. Demo mode—no password is checked."}
          </p>

          <div className="auth-tabs" role="tablist">
            <button
              role="tab"
              type="button"
              aria-selected={!isSignup}
              className={!isSignup ? "active" : undefined}
              onClick={() => { setMode("signin"); setError(null); }}
            >Sign in</button>
            <button
              role="tab"
              type="button"
              aria-selected={isSignup}
              className={isSignup ? "active" : undefined}
              onClick={() => { setMode("signup"); setError(null); }}
            >Create account</button>
          </div>

          <form className="auth-form" onSubmit={submit} noValidate>
            {isSignup ? (
              <label className="field">
                <span className="field-label"><span>Your name</span></span>
                <input {...form.register("name")} autoComplete="name" placeholder="Leonardo Sánchez" />
                {form.formState.errors.name ? (
                  <span className="field-error">{form.formState.errors.name.message}</span>
                ) : null}
              </label>
            ) : null}
            <label className="field">
              <span className="field-label"><span>Email</span></span>
              <input {...form.register("email")} type="email" autoComplete="email" placeholder="you@work.com" />
              {form.formState.errors.email ? (
                <span className="field-error">{form.formState.errors.email.message}</span>
              ) : null}
            </label>
            <label className="field">
              <span className="field-label">
                <span>Password</span>
                {!isSignup ? <small>Demo — any 6+ characters</small> : null}
              </span>
              <input
                {...form.register("password")}
                type="password"
                autoComplete={isSignup ? "new-password" : "current-password"}
                placeholder="••••••••"
              />
              {form.formState.errors.password ? (
                <span className="field-error">{form.formState.errors.password.message}</span>
              ) : null}
            </label>

            {error ? <ErrorPanel title="Sign-in blocked" detail={error} /> : null}

            <button className="button button-wide" type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <><LoaderCircle className="spin" size={16} /> {isSignup ? "Creating account…" : "Signing in…"}</>
              ) : (
                <>{isSignup ? "Create my account" : "Continue"} <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="auth-foot">
            <Link to="/">← Back to landing</Link>
          </p>
        </div>
      </section>
    </div>
  );
}