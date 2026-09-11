import { SiteShell } from "@/components/layout/site-shell";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default function ReportsPage() {
  return (
    <SiteShell>
      <PageHeader
        title="Reports"
        description="A dedicated area for progress summaries, operational snapshots, and stakeholder reporting once analytics are configured."
      />

      <EmptyState
        title="No reports yet"
        description="Reporting outputs and metrics dashboards will be connected here when the data model and reporting logic are implemented."
        actionLabel="Outline reporting needs"
      />
    </SiteShell>
  );
}
