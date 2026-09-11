"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const INITIAL_FORM = {
  email: "",
  password: "",
};

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createSupabaseBrowserClient();
  const isConfigured = Boolean(supabase);

  const configMessage = isConfigured
    ? "Use your Supabase email and password to access Projected Histories."
    : "Authentication is not fully configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to continue.";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!form.email.trim() || !form.password.trim()) {
      setError("Please enter both your email address and password.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setError("Authentication is not configured. Please add the required Supabase environment variables.");
      return;
    }

    setIsLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email.trim(),
        password: form.password,
      });

      if (signInError) {
        setError(signInError.message || "Unable to sign in. Please check your credentials and try again.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Unable to sign in right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f4ef] px-4 py-8 text-stone-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 transition-colors hover:border-stone-400 hover:text-stone-900"
          >
            ← Back to dashboard
          </Link>
        </div>

        <div className="grid min-h-[calc(100vh-8rem)] overflow-hidden rounded-[2rem] border border-stone-200 bg-[#fbfaf8] shadow-[0_18px_60px_rgba(28,25,23,0.08)] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-between border-b border-stone-200 bg-[#efe9e1] p-6 sm:p-8 lg:border-b-0 lg:border-r">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                Projected Histories
              </p>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
                St Peter’s Goes Digital
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-stone-700 sm:text-base">
                Secure access for the Projected Histories workspace. Sign in with your Projected Histories
                credentials to continue into the approved Phase 1 application.
              </p>
            </div>

            <div className="mt-8 rounded-3xl border border-stone-300 bg-[#f7f4ef] p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                Access note
              </p>
              <p className="mt-2 text-sm leading-6 text-stone-700">{configMessage}</p>
            </div>
          </div>

          <div className="flex items-center justify-center p-6 sm:p-8">
            <div className="w-full max-w-md">
              <div className="mb-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                  Sign in
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-stone-900">Welcome back</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-stone-700">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                    className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-900/15"
                    placeholder="name@example.com"
                    aria-invalid={Boolean(error)}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-stone-700">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={form.password}
                    onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                    className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-900/15"
                    placeholder="Enter your password"
                    aria-invalid={Boolean(error)}
                  />
                </div>

                {error ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-stone-50 transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-400"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <p className="mt-5 text-center text-sm text-stone-600">
                Don&apos;t have an account? {" "}
                <Link href="/register" className="font-medium text-stone-900 underline-offset-4 hover:underline">
                  Request access
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
