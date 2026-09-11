import { SiteShell } from "@/components/layout/site-shell";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default function MeetingsPage() {
  return (
    <SiteShell>
      <PageHeader
        title="Meetings"
        description="Placeholder space for standing meetings, updates, and event planning once scheduling and collaboration systems are connected."
      />

      <EmptyState
        title="No meetings configured yet"
        description="Calendar items, planning notes, and meeting history will be added when the collaboration layer is ready."
        actionLabel="Plan next review"
      />
    </SiteShell>
  );
}
