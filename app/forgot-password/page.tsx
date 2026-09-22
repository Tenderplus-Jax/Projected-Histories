"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
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
      const redirectTo = new URL("/reset-password", window.location.origin).toString();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(normalizedEmail, { redirectTo });

      if (resetError) {
        setError("Unable to send the password reset email right now. Please try again.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Unable to send the password reset email right now. Please try again.");
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
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900">Reset your password</h1>
            <p className="mt-3 text-sm leading-6 text-stone-700 sm:text-base">
              Enter your email address and we will send instructions to reset your Projected Histories password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 max-w-md space-y-5" noValidate>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-stone-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-900/15"
                placeholder="name@example.com"
                aria-invalid={Boolean(error)}
              />
            </div>

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm leading-6 text-emerald-700" role="status">
                If an account matches that email address, password reset instructions have been sent. Please check
                your inbox and follow the link to choose a new password.
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex w-full items-center justify-center rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-stone-50 transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-400"
            >
              {isLoading ? "Sending instructions..." : "Send reset instructions"}
            </button>
          </form>

          <p className="mt-6 text-sm text-stone-600">
            Remembered your password?{" "}
            <Link href="/login" className="font-medium text-stone-900 underline-offset-4 hover:underline">
              Return to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
