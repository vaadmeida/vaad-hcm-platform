const SkeletonLoader = () => {
  return (
    <div className="animate-pulse space-y-6">
      
      {/* Stats cards skeleton */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="h-4 w-24 rounded bg-slate-200" />
                <div className="h-9 w-16 rounded bg-slate-200" />
                <div className="h-3 w-32 rounded bg-slate-200" />
              </div>

              <div className="h-12 w-12 rounded-xl bg-slate-200" />
            </div>
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-5 h-5 w-40 rounded bg-slate-200" />

          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between"
              >
                <div className="h-4 w-36 rounded bg-slate-200" />
                <div className="h-4 w-20 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-5 h-5 w-32 rounded bg-slate-200" />

          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-4 w-full rounded bg-slate-200"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;