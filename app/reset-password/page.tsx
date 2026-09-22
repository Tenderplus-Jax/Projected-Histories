"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const isAuthConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCheckingSession, setIsCheckingSession] = useState(isAuthConfigured);
  const [hasSession, setHasSession] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    isAuthConfigured ? null : "Authentication is not configured. Please add the required Supabase environment variables.",
  );
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    let isMounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) {
        return;
      }

      if (event === "PASSWORD_RECOVERY" && session) {
        setHasSession(true);
        setIsCheckingSession(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) {
        return;
      }

      setHasSession(Boolean(session));
      setIsCheckingSession(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!newPassword || !confirmPassword) {
      setError("Please enter and confirm your new password.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Your password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("The password confirmation does not match.");
      return;
    }

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setError("Authentication is not configured. Please add the required Supabase environment variables.");
      return;
    }

    setIsLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

      if (updateError) {
        setError("Unable to update your password. Please request a new reset email and try again.");
        return;
      }

      setSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError("Unable to update your password. Please request a new reset email and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f4ef] px-4 py-8 text-stone-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 transition-colors hover:border-stone-400 hover:text-stone-900"
          >
            &larr; Back to sign in
          </Link>
        </div>

        <div className="rounded-[2rem] border border-stone-200 bg-[#fbfaf8] p-6 shadow-[0_18px_60px_rgba(28,25,23,0.08)] sm:p-8">
          <div className="max-w-xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">
              Projected Histories
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900">Choose a new password</h1>
            <p className="mt-3 text-sm leading-6 text-stone-700 sm:text-base">
              Set a new password for your Projected Histories account. You do not need to enter your old password.
            </p>
          </div>

          {isCheckingSession ? (
            <div className="mt-8 max-w-md rounded-xl border border-stone-200 bg-stone-50 px-3 py-3 text-sm text-stone-600">
              Checking your password reset link...
            </div>
          ) : null}

          {!isCheckingSession && !hasSession && !success ? (
            <div className="mt-8 max-w-md rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-sm leading-6 text-amber-800" role="alert">
              This password reset link is invalid or has expired. Request a new reset email to continue.
            </div>
          ) : null}

          {!isCheckingSession && hasSession && !success ? (
            <form onSubmit={handleSubmit} className="mt-8 max-w-md space-y-5" noValidate>
              <div className="space-y-2">
                <label htmlFor="newPassword" className="block text-sm font-medium text-stone-700">
                  New password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-900/15"
                  placeholder="Create a new password"
                  aria-invalid={Boolean(error)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-stone-700">
                  Confirm new password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-900/15"
                  placeholder="Confirm your new password"
                  aria-invalid={Boolean(error)}
                />
              </div>

              {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-stone-50 transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-400"
              >
                {isLoading ? "Updating password..." : "Update password"}
              </button>
            </form>
          ) : null}

          {success ? (
            <div className="mt-8 max-w-md space-y-4">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm leading-6 text-emerald-700" role="status">
                Your password has been updated successfully.
              </div>
              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-stone-50 transition hover:bg-stone-700"
              >
                Return to sign in
              </Link>
            </div>
          ) : null}

          {!isCheckingSession && !hasSession && !success ? (
            <p className="mt-6 text-sm text-stone-600">
              <Link href="/forgot-password" className="font-medium text-stone-900 underline-offset-4 hover:underline">
                Request another reset email
              </Link>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
