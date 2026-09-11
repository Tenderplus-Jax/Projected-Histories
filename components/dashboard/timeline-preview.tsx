import { projectConfig } from "@/lib/project-config";

export function TimelinePreview() {
  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">Project timeline</p>
          <h3 className="mt-2 text-xl font-semibold text-stone-900">Phase schedule</h3>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {projectConfig.phaseDates.map((phase, index) => (
          <div key={phase.id} className="flex items-start gap-4 rounded-2xl border border-stone-200 bg-stone-50 p-4">
            <div className="flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-400 bg-white text-xs font-semibold text-stone-700">
                {index + 1}
              </div>
              {index < projectConfig.phaseDates.length - 1 ? (
                <div className="mt-2 h-10 w-px bg-stone-300" aria-hidden="true" />
              ) : null}
            </div>
            <div className="flex-1">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <h4 className="text-base font-semibold text-stone-900">{phase.name}</h4>
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">Confirmed</span>
              </div>
              <p className="mt-2 text-sm text-stone-600">
                {phase.start} – {phase.end}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
