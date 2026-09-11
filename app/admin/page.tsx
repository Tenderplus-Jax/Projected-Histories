"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type ProfileRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_admin: boolean;
  created_at: string;
};

type MembershipRow = {
  id: string;
  user_id: string;
  status: "pending" | "approved" | "rejected" | "suspended";
  role: string;
  created_at: string;
  updated_at: string;
};

export default function AdminPage() {
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [memberships, setMemberships] = useState<MembershipRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      const supabase = createSupabaseBrowserClient();

      if (!supabase) {
        setError("Authentication is not configured. Please add the required Supabase environment variables.");
        setLoading(false);
        return;
      }

      try {
        const [profilesResult, membershipsResult] = await Promise.all([
          supabase.from("profiles").select("id, first_name, last_name, email, is_admin, created_at").order("created_at", { ascending: false }),
          supabase.from("project_memberships").select("id, user_id, status, role, created_at, updated_at").order("created_at", { ascending: false }),
        ]);

        if (profilesResult.error) {
          throw profilesResult.error;
        }

        if (membershipsResult.error) {
          throw membershipsResult.error;
        }

        setProfiles((profilesResult.data ?? []) as ProfileRow[]);
        setMemberships((membershipsResult.data ?? []) as MembershipRow[]);
      } catch {
        setError("Admin access is required to view or manage Projected Histories member approvals.");
      } finally {
        setLoading(false);
      }
    }

    loadAdminData();
  }, []);

  async function updateStatus(membershipId: string, nextStatus: MembershipRow["status"]) {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setError("Authentication is not configured. Please add the required Supabase environment variables.");
      return;
    }

    const { error: updateError } = await supabase
      .from("project_memberships")
      .update({ status: nextStatus })
      .eq("id", membershipId);

    if (updateError) {
      setError("Unable to update the membership status.");
      return;
    }

    setMemberships((current) =>
      current.map((membership) =>
        membership.id === membershipId ? { ...membership, status: nextStatus } : membership,
      ),
    );
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

        <div className="rounded-[2rem] border border-stone-200 bg-[#fbfaf8] p-6 shadow-[0_18px_60px_rgba(28,25,23,0.08)] sm:p-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">Admin</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900">Project access approvals</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-700 sm:text-base">
            This placeholder area establishes the approval foundation for Projected Histories project membership.
            Pending users must verify their email before they can be approved for access.
          </p>

          {loading ? (
            <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-600">
              Loading approvals...
            </div>
          ) : null}

          {error ? (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {!loading && !error ? (
            <div className="mt-8 overflow-hidden rounded-2xl border border-stone-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-stone-200 bg-white">
                  <thead className="bg-stone-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                        Member
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                        Role
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {profiles.map((profile) => {
                      const membership = memberships.find((row) => row.user_id === profile.id);
                      const status = membership?.status ?? "No membership record";
                      const role = membership?.role ?? "member";

                      return (
                        <tr key={profile.id}>
                          <td className="px-4 py-3">
                            <div>
                              <p className="text-sm font-medium text-stone-900">
                                {profile.first_name} {profile.last_name}
                              </p>
                              <p className="text-xs text-stone-500">{profile.email}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex rounded-full border border-stone-300 bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700">
                              {status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-stone-700">
                            {role}
                          </td>
                          <td className="px-4 py-3">
                            {membership ? (
                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() => updateStatus(membership.id, "approved")}
                                  className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100"
                                >
                                  Approve
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateStatus(membership.id, "rejected")}
                                  className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs font-medium text-amber-700 transition hover:bg-amber-100"
                                >
                                  Reject
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateStatus(membership.id, "suspended")}
                                  className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100"
                                >
                                  Suspend
                                </button>
                              </div>
                            ) : (
                              <p className="text-xs text-stone-500">No membership record available yet.</p>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
