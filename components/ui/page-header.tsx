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
    <div className="mb-6 flex flex-col gap-4 border-b border-stone-200 pb-5 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">Projected Histories</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">{title}</h2>
        {description ? <p className="mt-2 max-w-3xl text-sm text-stone-600">{description}</p> : null}
      </div>

      {actions && actions.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {actions.map((action, index) => {
            const baseClasses =
              action.variant === "primary"
                ? "bg-stone-900 text-stone-50 hover:bg-stone-700"
                : "border border-stone-300 bg-white text-stone-700 hover:border-stone-400 hover:text-stone-900";

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
