import { SiteShell } from "@/components/layout/site-shell";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default function WorkstreamsPage() {
  return (
    <SiteShell>
      <PageHeader
        title="Workstreams"
        description="This page establishes the structure for future project workstreams, with no invented names or records at this stage."
        actions={[{ label: "View timeline", href: "/timeline", variant: "secondary" }]}
      />

      <div className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">Workstream foundation</p>
        <h3 className="mt-2 text-xl font-semibold text-stone-900">Example / To Be Confirmed</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Example</p>
              <p className="mt-2 text-base font-semibold text-stone-900">Workstream {index + 1}</p>
              <p className="mt-2 text-sm text-stone-600">To be confirmed as project requirements are refined.</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <EmptyState
          title="No workstreams yet"
          description="Workstream cards and their configuration will later be loaded from project data and connected to the broader planning system."
        />
      </div>
    </SiteShell>
  );
}
