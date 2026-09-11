import { SiteShell } from "@/components/layout/site-shell";
import { ActivityPreview, MyWorkPreview } from "@/components/dashboard/placeholder-cards";
import { ProjectStatusCard } from "@/components/dashboard/project-status-card";
import { TimelinePreview } from "@/components/dashboard/timeline-preview";
import { PageHeader } from "@/components/ui/page-header";
import { projectConfig } from "@/lib/project-config";

export default function Home() {
  return (
    <SiteShell>
      <PageHeader
        title="Dashboard"
        description="A responsive foundation for the Projected Histories workspace. This interface is structured for future Supabase and collaboration integrations, while keeping the current build honest and placeholder-driven."
        actions={[
          { label: "Project overview", href: "/timeline", variant: "secondary" },
          { label: "Review settings", href: "/settings", variant: "primary" },
        ]}
      />

      <section className="mb-6 rounded-3xl border border-stone-200 bg-[#f0ebe3] p-5 sm:p-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">Welcome</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
          {projectConfig.name}
        </h3>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-700 sm:text-base">
          This internal portal is being prepared as a secure, human-centred workspace for the St Peter’s Goes
          Digital project. The current build establishes the visual identity, navigation system, and placeholder
          pages needed for the next phases of development.
        </p>
      </section>

      <ProjectStatusCard />

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <MyWorkPreview />
        <ActivityPreview />
      </div>

      <div className="mt-6">
        <TimelinePreview />
      </div>
    </SiteShell>
  );
}
