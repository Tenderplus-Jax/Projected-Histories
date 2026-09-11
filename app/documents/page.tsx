import { SiteShell } from "@/components/layout/site-shell";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default function DocumentsPage() {
  return (
    <SiteShell>
      <PageHeader
        title="Documents"
        description="This area is reserved for project files, reference material, and shared documentation once storage and access are configured."
      />

      <EmptyState
        title="No documents yet"
        description="Document collections, uploads, and version history will be connected here in a later phase."
        actionLabel="Review requirements"
      />
    </SiteShell>
  );
}
