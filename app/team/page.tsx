import { SiteShell } from "@/components/layout/site-shell";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default function TeamPage() {
  return (
    <SiteShell>
      <PageHeader
        title="Team"
        description="This page is prepared for internal roles, responsibilities, and contact information once user management is implemented."
      />

      <EmptyState
        title="No team records yet"
        description="Team members, role assignments, and contact details will be configured in a later phase."
        actionLabel="Define roles"
      />
    </SiteShell>
  );
}
