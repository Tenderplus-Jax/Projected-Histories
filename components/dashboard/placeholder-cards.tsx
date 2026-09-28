import { EmptyState } from "@/components/ui/empty-state";

export function MyWorkPreview() {
  return (
    <div className="architectural-card rounded-3xl p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="relative z-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">My work</p>
          <h3 className="mt-2 text-xl font-semibold text-stone-900">Assigned work</h3>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 shadow-[0_10px_18px_rgba(12,16,18,0.04)]">
          <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">
            Workspace
          </div>
          <p className="text-sm font-medium text-stone-700">No assigned items yet</p>
          <p className="mt-2 text-sm text-stone-600">
            This area will later show work assigned to the authenticated user once integration is configured.
          </p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 shadow-[0_10px_18px_rgba(12,16,18,0.04)]">
          <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">
            Planning
          </div>
          <p className="text-sm font-medium text-stone-700">Upcoming tasks</p>
          <p className="mt-2 text-sm text-stone-600">To be confirmed in later phases.</p>
        </div>
      </div>
    </div>
  );
}

export function ActivityPreview() {
  return (
    <div className="architectural-card rounded-3xl p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="relative z-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">Activity</p>
          <h3 className="mt-2 text-xl font-semibold text-stone-900">Recent activity</h3>
        </div>
      </div>

      <div className="mt-5">
        <EmptyState
          title="No activity yet"
          description="The activity feed will connect to project events, updates, and collaboration actions in a future phase."
        />
      </div>
    </div>
  );
}
