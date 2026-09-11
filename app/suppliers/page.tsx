import { SiteShell } from "@/components/layout/site-shell";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default function SuppliersPage() {
  return (
    <SiteShell>
      <PageHeader
        title="Suppliers"
        description="This section is reserved for partner, service, and supplier coordination as the project grows."
      />

      <EmptyState
        title="No suppliers yet"
        description="Supplier records, engagement notes, and contact information will be loaded once the project data model is configured."
        actionLabel="Prepare supplier list"
      />
    </SiteShell>
  );
}
