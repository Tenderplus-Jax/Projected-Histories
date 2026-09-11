import { SiteShell } from "@/components/layout/site-shell";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default function TasksPage() {
  return (
    <SiteShell>
      <PageHeader
        title="Tasks"
        description="A future task workspace for planned actions, team ownership, and delivery tracking. The current build is intentionally empty while system requirements are still being confirmed."
      />

      <EmptyState
        title="No tasks configured yet"
        description="Task lists, statuses, and deadlines will be added when the project workflow and database schema are defined."
        actionLabel="Review plans"
      />
    </SiteShell>
  );
}
