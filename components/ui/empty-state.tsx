export function EmptyState({
  title,
  description,
  actionLabel,
}: {
  title: string;
  description: string;
  actionLabel?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-stone-300 bg-white text-lg text-stone-600">
        •
      </div>
      <h3 className="mt-4 text-lg font-semibold text-stone-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>
      {actionLabel ? (
        <button
          type="button"
          className="mt-5 inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-stone-400 hover:text-stone-900"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
