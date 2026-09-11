"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.password || !form.confirmPassword) {
      setError("Please complete all required fields before creating your account.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (form.password.length < 6) {
      setError("Your password must be at least 6 characters long.");
      return;
    }

    if (form.password !== form.confirmPassword) {
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
      const { error: signUpError } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
          data: {
            first_name: form.firstName.trim(),
            last_name: form.lastName.trim(),
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message || "Unable to create your account right now. Please try again.");
        return;
      }

      setSuccess(
        "Your account has been created successfully. Please check your email to verify your address. Your Projected Histories access will remain pending until an administrator approves your membership.",
      );
      setForm(INITIAL_FORM);
    } catch {
      setError("Unable to create your account right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f4ef] px-4 py-8 text-stone-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 transition-colors hover:border-stone-400 hover:text-stone-900"
          >
            ← Back to sign in
          </Link>
        </div>

        <div className="grid min-h-[calc(100vh-8rem)] overflow-hidden rounded-[2rem] border border-stone-200 bg-[#fbfaf8] shadow-[0_18px_60px_rgba(28,25,23,0.08)] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-between border-b border-stone-200 bg-[#efe9e1] p-6 sm:p-8 lg:border-b-0 lg:border-r">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                Projected Histories
              </p>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
                Request Project Access
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-stone-700 sm:text-base">
                Your account will require email verification and administrator approval before you can access the
                Projected Histories workspace.
              </p>
            </div>

            <div className="mt-8 rounded-3xl border border-stone-300 bg-[#f7f4ef] p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                Access note
              </p>
              <p className="mt-2 text-sm leading-6 text-stone-700">
                Create your own password during registration. Projected Histories will only use Supabase Auth for
                identity and session management.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center p-6 sm:p-8">
            <div className="w-full max-w-lg">
              <div className="mb-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                  Register
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-stone-900">Create your account</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-medium text-stone-700">
                      First name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      value={form.firstName}
                      onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))}
                      className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-900/15"
                      placeholder="First name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-medium text-stone-700">
                      Last name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      value={form.lastName}
                      onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))}
                      className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-900/15"
                      placeholder="Last name"
                    />
                  </div>
                </div>

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
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                    className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-900/15"
                    placeholder="Create a password"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-stone-700">
                    Confirm password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, confirmPassword: event.target.value }))
                    }
                    className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-900/15"
                    placeholder="Confirm your password"
                  />
                </div>

                {error ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                  </div>
                ) : null}

                {success ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-700">
                    {success}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-stone-50 transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-400"
                >
                  {isLoading ? "Creating account..." : "Create account"}
                </button>
              </form>

              <p className="mt-5 text-center text-sm text-stone-600">
                Already have an account? {" "}
                <Link href="/login" className="font-medium text-stone-900 underline-offset-4 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
