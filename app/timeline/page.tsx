import { SiteShell } from "@/components/layout/site-shell";
import { PageHeader } from "@/components/ui/page-header";
import { projectConfig } from "@/lib/project-config";

export default function TimelinePage() {
  return (
    <SiteShell>
      <PageHeader
        title="Timeline"
        description="A reusable timeline foundation for the multi-phase Projected Histories project. Only confirmed dates are shown at this stage."
      />

      <div className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-6">
        <div className="space-y-4">
          {projectConfig.phaseDates.map((phase, index) => (
            <div key={phase.id} className="flex gap-4 rounded-2xl border border-stone-200 bg-stone-50 p-4">
              <div className="flex flex-col items-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-400 bg-white text-sm font-semibold text-stone-700">
                  {index + 1}
                </div>
                {index < projectConfig.phaseDates.length - 1 ? (
                  <div className="mt-2 h-10 w-px bg-stone-300" aria-hidden="true" />
                ) : null}
              </div>

              <div className="flex-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-lg font-semibold text-stone-900">{phase.name}</h3>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">Confirmed</span>
                </div>
                <p className="mt-2 text-sm text-stone-600">
                  {phase.start} – {phase.end}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
