import { SiteShell } from "@/components/layout/site-shell";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default function AnnouncementsPage() {
  return (
    <SiteShell>
      <PageHeader
        title="Announcements"
        description="A communications area for project updates, stakeholder notices, and internal news once the publishing workflow is ready."
      />

      <EmptyState
        title="No announcements yet"
        description="Announcements, release notes, and internal updates will be configured when the content workflow is implemented."
        actionLabel="Draft announcement plan"
      />
    </SiteShell>
  );
}
