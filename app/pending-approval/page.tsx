import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { PageHeader } from "@/components/ui/page-header";

export default function PendingApprovalPage() {
  return (
    <SiteShell>
      <PageHeader
        title="Pending approval"
        description="Your account has been registered. Project access remains pending until an administrator reviews and approves your request."
      />

      <section className="rounded-3xl border border-stone-200 bg-[#f0ebe3] p-6 sm:p-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">Access status</p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-stone-900">
          Awaiting administrator approval
        </h3>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-700 sm:text-base">
          Your account has been registered successfully. If you have not already done so, please verify your email
          address first. Once that is complete, Projected Histories will wait for administrator approval before
          granting project access.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/login"
            className="inline-flex items-center rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-stone-50 transition hover:bg-stone-700"
          >
            Return to sign in
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
