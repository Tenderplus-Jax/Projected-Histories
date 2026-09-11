import { SiteShell } from "@/components/layout/site-shell";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default function RisksAndIssuesPage() {
  return (
    <SiteShell>
      <PageHeader
        title="Risks & Issues"
        description="A placeholder area for tracking project risks, blockers, and mitigation updates once reporting workflows are defined."
      />

      <EmptyState
        title="No risks or issues yet"
        description="Risk register entries, issue logs, and status updates will appear here after the operational model is configured."
        actionLabel="Define risk process"
      />
    </SiteShell>
  );
}
