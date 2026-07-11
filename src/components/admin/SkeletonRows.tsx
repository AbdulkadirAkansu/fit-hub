export function TableSkeletonRows({ rows = 6, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r}>
          {Array.from({ length: cols }).map((__, c) => (
            <td key={c} className="px-5 py-3.5">
              <div className={`h-4 skeleton skeleton-shimmer rounded-lg ${c === 0 ? "w-40" : "w-20"}`} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function CardSkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-surface p-6 space-y-4">
          <div className="flex justify-between">
            <div className="h-5 w-20 skeleton skeleton-shimmer rounded-lg" />
            <div className="h-4 w-16 skeleton skeleton-shimmer rounded-lg" />
          </div>
          <div className="h-4 w-3/4 skeleton skeleton-shimmer rounded-lg" />
          <div className="h-3 w-full skeleton skeleton-shimmer rounded-lg" />
          <div className="h-3 w-5/6 skeleton skeleton-shimmer rounded-lg" />
        </div>
      ))}
    </div>
  );
}
