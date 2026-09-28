"use client";

import { useCallback, useEffect, useState } from "react";
import { SiteShell } from "@/components/layout/site-shell";
import { PageHeader } from "@/components/ui/page-header";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type MembershipStatus = "pending" | "approved" | "rejected" | "suspended";

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
  status: MembershipStatus;
  role: string;
  created_at: string;
  updated_at: string;
};

const statusLabels: Record<MembershipStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  suspended: "Suspended",
};

const statusStyles: Record<MembershipStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-800",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-800",
  rejected: "border-stone-300 bg-stone-100 text-stone-700",
  suspended: "border-red-200 bg-red-50 text-red-800",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function displayName(profile: ProfileRow) {
  const name = `${profile.first_name} ${profile.last_name}`.trim();
  return name || "Unnamed user";
}

function StatusBadge({ status }: { status: MembershipStatus }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}>
      {statusLabels[status]}
    </span>
  );
}

function SummaryCard({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4">
      <div className={`mb-4 h-1.5 w-10 rounded-full ${tone}`} />
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">{value}</p>
    </div>
  );
}

export default function AdminPage() {
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [memberships, setMemberships] = useState<MembershipRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionKey, setActionKey] = useState<string | null>(null);

  const loadAdminData = useCallback(async () => {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setError("Authentication is not configured. Please add the required Supabase environment variables.");
      setLoading(false);
      return;
    }

    setError(null);

    try {
      const [profilesResult, membershipsResult] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, first_name, last_name, email, is_admin, created_at")
          .order("created_at", { ascending: false }),
        supabase
          .from("project_memberships")
          .select("id, user_id, status, role, created_at, updated_at")
          .order("created_at", { ascending: false }),
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
      setError("Unable to load access requests. Confirm that your administrator account is still active.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadAdminData();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadAdminData]);

  const profileById = new Map(profiles.map((profile) => [profile.id, profile]));
  const membershipRows = memberships
    .map((membership) => ({ membership, profile: profileById.get(membership.user_id) }))
    .filter((row): row is { membership: MembershipRow; profile: ProfileRow } => Boolean(row.profile));
  const pendingRows = membershipRows.filter(({ membership }) => membership.status === "pending");
  const approvedRows = membershipRows.filter(({ membership }) => membership.status === "approved");
  const otherRows = membershipRows.filter(
    ({ membership }) => membership.status === "rejected" || membership.status === "suspended",
  );
  const roleOptions = Array.from(
    new Set(memberships.map((membership) => membership.role).filter((role) => role.trim())),
  ).sort();

  async function updateMembershipStatus(membership: MembershipRow, nextStatus: MembershipStatus) {
    const profile = profileById.get(membership.user_id);
    const name = profile ? displayName(profile) : "this member";
    const actionLabel = statusLabels[nextStatus].toLowerCase();

    if (
      nextStatus !== "approved" &&
      !window.confirm(`Are you sure you want to mark ${name} as ${actionLabel}?`)
    ) {
      return;
    }

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setError("Authentication is not configured. Please add the required Supabase environment variables.");
      return;
    }

    setActionKey(`${membership.id}:${nextStatus}`);
    setError(null);
    setFeedback(null);

    const { error: updateError } = await supabase
      .from("project_memberships")
      .update({ status: nextStatus })
      .eq("id", membership.id);

    if (updateError) {
      setError("Unable to update the membership status. Your administrator permissions may have changed.");
      setActionKey(null);
      return;
    }

    setFeedback(`${name} is now ${actionLabel}.`);
    await loadAdminData();
    setActionKey(null);
  }

  async function updateMembershipRole(membership: MembershipRow, nextRole: string) {
    if (nextRole === membership.role) {
      return;
    }

    const profile = profileById.get(membership.user_id);
    const name = profile ? displayName(profile) : "this member";

    if (!window.confirm(`Change ${name}'s role from ${membership.role} to ${nextRole}?`)) {
      return;
    }

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setError("Authentication is not configured. Please add the required Supabase environment variables.");
      return;
    }

    setActionKey(`${membership.id}:role`);
    setError(null);
    setFeedback(null);

    const { error: updateError } = await supabase
      .from("project_memberships")
      .update({ role: nextRole })
      .eq("id", membership.id);

    if (updateError) {
      setError("Unable to update the member role. Your administrator permissions may have changed.");
      setActionKey(null);
      return;
    }

    setFeedback(`${name}'s role was updated to ${nextRole}.`);
    await loadAdminData();
    setActionKey(null);
  }

  function renderRoleControl(membership: MembershipRow) {
    if (roleOptions.length < 2) {
      return <span className="text-sm text-stone-700">{membership.role || "Unassigned"}</span>;
    }

    return (
      <select
        aria-label={`Change role for membership ${membership.id}`}
        value={membership.role}
        disabled={Boolean(actionKey)}
        onChange={(event) => void updateMembershipRole(membership, event.target.value)}
        className="rounded-lg border border-stone-300 bg-white px-2.5 py-1.5 text-sm text-stone-700 outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/15 disabled:bg-stone-100"
      >
        {roleOptions.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>
    );
  }

  function renderEmptyState(title: string, description: string) {
    return (
      <div className="border-t border-stone-200 bg-stone-50 px-5 py-8 text-center">
        <p className="text-sm font-semibold text-stone-900">{title}</p>
        <p className="mt-1 text-sm text-stone-600">{description}</p>
      </div>
    );
  }

  return (
    <SiteShell>
      <PageHeader
        title="Project access"
        description="Review access requests, manage approved members, and keep project membership up to date."
        actions={[{ label: "Back to dashboard", href: "/", variant: "secondary" }]}
      />

      <section className="mb-6 rounded-3xl border border-stone-200 bg-[#f0ebe3] p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">Administrator workspace</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
              Access and membership management
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-700">
              Approve people who are ready to join the project and keep existing access aligned with the current team.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setFeedback(null);
              void loadAdminData();
            }}
            disabled={loading || Boolean(actionKey)}
            className="inline-flex shrink-0 items-center justify-center rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:border-stone-400 hover:text-stone-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Refresh data
          </button>
        </div>
      </section>

      {loading ? (
        <div className="mb-6 rounded-2xl border border-stone-200 bg-white p-5 text-sm text-stone-600">
          Loading access and membership data...
        </div>
      ) : null}

      {error ? (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
          {error}
        </div>
      ) : null}

      {feedback ? (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800" role="status">
          {feedback}
        </div>
      ) : null}

      {!loading && !error ? (
        <>
          <section aria-label="Membership summary" className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard label="Pending requests" value={pendingRows.length} tone="bg-amber-400" />
            <SummaryCard label="Approved members" value={approvedRows.length} tone="bg-emerald-500" />
            <SummaryCard
              label="Rejected members"
              value={memberships.filter((membership) => membership.status === "rejected").length}
              tone="bg-stone-400"
            />
            <SummaryCard
              label="Suspended members"
              value={memberships.filter((membership) => membership.status === "suspended").length}
              tone="bg-red-400"
            />
          </section>

          <section className="mb-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
            <div className="flex flex-col gap-1 border-b border-stone-200 px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">Review queue</p>
                <h2 className="mt-1 text-xl font-semibold text-stone-900">Access requests</h2>
              </div>
              <p className="text-sm text-stone-500">{pendingRows.length} awaiting review</p>
            </div>

            {pendingRows.length === 0 ? (
              renderEmptyState("No pending requests", "New registrations will appear here when they need review.")
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-stone-200">
                  <thead className="bg-stone-50">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">User</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Requested</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Status</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Role</th>
                      <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {pendingRows.map(({ membership, profile }) => (
                      <tr key={membership.id}>
                        <td className="whitespace-nowrap px-5 py-4">
                          <p className="text-sm font-medium text-stone-900">{displayName(profile)}</p>
                          <p className="mt-0.5 text-xs text-stone-500">{profile.email}</p>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-stone-700">{formatDate(profile.created_at)}</td>
                        <td className="px-5 py-4"><StatusBadge status={membership.status} /></td>
                        <td className="px-5 py-4 text-sm text-stone-700">{membership.role || "Unassigned"}</td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => void updateMembershipStatus(membership, "approved")}
                              disabled={Boolean(actionKey)}
                              className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800 transition-colors hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {actionKey === `${membership.id}:approved` ? "Approving..." : "Approve"}
                            </button>
                            <button
                              type="button"
                              onClick={() => void updateMembershipStatus(membership, "rejected")}
                              disabled={Boolean(actionKey)}
                              className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-medium text-stone-700 transition-colors hover:border-stone-400 hover:text-stone-900 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {actionKey === `${membership.id}:rejected` ? "Rejecting..." : "Reject"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="mb-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
            <div className="flex flex-col gap-1 border-b border-stone-200 px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">Current access</p>
                <h2 className="mt-1 text-xl font-semibold text-stone-900">Approved members</h2>
              </div>
              <p className="text-sm text-stone-500">{approvedRows.length} active members</p>
            </div>

            {approvedRows.length === 0 ? (
              renderEmptyState("No approved members yet", "Approved accounts will appear here after their requests are reviewed.")
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-stone-200">
                  <thead className="bg-stone-50">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Member</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Role</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Status</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Approved / updated</th>
                      <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {approvedRows.map(({ membership, profile }) => (
                      <tr key={membership.id}>
                        <td className="whitespace-nowrap px-5 py-4">
                          <p className="text-sm font-medium text-stone-900">{displayName(profile)}</p>
                          <p className="mt-0.5 text-xs text-stone-500">{profile.email}</p>
                        </td>
                        <td className="px-5 py-4">{renderRoleControl(membership)}</td>
                        <td className="px-5 py-4"><StatusBadge status={membership.status} /></td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-stone-700">{formatDate(membership.updated_at)}</td>
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => void updateMembershipStatus(membership, "suspended")}
                            disabled={Boolean(actionKey)}
                            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-800 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {actionKey === `${membership.id}:suspended` ? "Suspending..." : "Suspend"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {otherRows.length > 0 ? (
            <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
              <div className="border-b border-stone-200 px-5 py-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">Follow-up</p>
                <h2 className="mt-1 text-xl font-semibold text-stone-900">Other membership statuses</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-stone-200">
                  <thead className="bg-stone-50">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Member</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Role</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Status</th>
                      <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {otherRows.map(({ membership, profile }) => (
                      <tr key={membership.id}>
                        <td className="whitespace-nowrap px-5 py-4">
                          <p className="text-sm font-medium text-stone-900">{displayName(profile)}</p>
                          <p className="mt-0.5 text-xs text-stone-500">{profile.email}</p>
                        </td>
                        <td className="px-5 py-4 text-sm text-stone-700">{membership.role || "Unassigned"}</td>
                        <td className="px-5 py-4"><StatusBadge status={membership.status} /></td>
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => void updateMembershipStatus(membership, "approved")}
                            disabled={Boolean(actionKey)}
                            className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800 transition-colors hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {actionKey === `${membership.id}:approved` ? "Restoring..." : "Restore access"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}
        </>
      ) : null}
    </SiteShell>
  );
}