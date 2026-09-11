import { SiteShell } from "@/components/layout/site-shell";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default function SettingsPage() {
  return (
    <SiteShell>
      <PageHeader
        title="Settings"
        description="Administrative configuration space for the Projected Histories workspace, staged for future Supabase and role-driven settings management."
      />

      <EmptyState
        title="Settings not yet configured"
        description="Project configuration, access controls, and workspace settings will be added in later development phases."
        actionLabel="Review configuration plan"
      />
    </SiteShell>
  );
}
