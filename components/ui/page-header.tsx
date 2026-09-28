import Link from "next/link";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: Array<{ label: string; href?: string; onClick?: () => void; variant?: "primary" | "secondary" }>;
}) {
  return (
    <div className="page-panel geometric-accent mb-6 rounded-[1.75rem] px-5 py-5 sm:px-6 md:flex md:items-end md:justify-between md:gap-4">
      <div className="relative z-10">
        <p className="section-tag">Projected Histories</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">{title}</h2>
        {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">{description}</p> : null}
      </div>

      {actions && actions.length > 0 ? (
        <div className="relative z-10 mt-4 flex flex-wrap gap-2 md:mt-0">
          {actions.map((action, index) => {
            const baseClasses =
              action.variant === "primary"
                ? "bg-[var(--heritage-blue)] text-white hover:bg-[var(--heritage-blue-deep)]"
                : "border border-stone-300 bg-white/90 text-stone-700 hover:border-[var(--heritage-blue)]/30 hover:text-[var(--heritage-blue-deep)]";

            if (action.href) {
              return (
                <Link
                  key={`${action.label}-${index}`}
                  href={action.href}
                  className={`inline-flex items-center justify-center rounded-xl px-3.5 py-2 text-sm font-medium transition-colors ${baseClasses}`}
                >
                  {action.label}
                </Link>
              );
            }

            return (
              <button
                key={`${action.label}-${index}`}
                type="button"
                className={`inline-flex items-center justify-center rounded-xl px-3.5 py-2 text-sm font-medium transition-colors ${baseClasses}`}
              >
                {action.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
