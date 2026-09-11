import { SiteShell } from "@/components/layout/site-shell";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default function MyWorkPage() {
  return (
    <SiteShell>
      <PageHeader
        title="My Work"
        description="This area is reserved for the authenticated user’s personal task view, upcoming work, and assigned actions once project access is connected."
        actions={[{ label: "Open settings", href: "/settings", variant: "secondary" }]}
      />

      <div className="grid gap-6">
        <EmptyState
          title="No personal work yet"
          description="Assigned work, upcoming tasks, and recent personal activity will appear here after the project workspace is configured."
          actionLabel="Configure workspace"
        />
      </div>
    </SiteShell>
  );
}
