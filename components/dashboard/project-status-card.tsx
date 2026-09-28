import { projectConfig } from "@/lib/project-config";

export function ProjectStatusCard() {
  return (
    <div className="architectural-card rounded-3xl p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative z-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">Project status</p>
          <h3 className="mt-2 text-xl font-semibold text-stone-900">{projectConfig.projectStatus}</h3>
        </div>
        <div className="relative z-10 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
          Awaiting configuration
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 shadow-[0_10px_20px_rgba(17,30,36,0.04)]">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">Current phase</span>
          </div>
          <p className="text-base font-semibold text-stone-900">{projectConfig.currentPhase}</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 shadow-[0_10px_20px_rgba(17,30,36,0.04)]">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">Next milestone</span>
          </div>
          <p className="text-base font-semibold text-stone-900">{projectConfig.nextMilestone}</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 shadow-[0_10px_20px_rgba(17,30,36,0.04)]">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">Learning theme</span>
          </div>
          <p className="text-base font-semibold text-stone-900">{projectConfig.learningTheme}</p>
        </div>
      </div>
    </div>
  );
}
