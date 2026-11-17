const GlobalListSkeleton = () => {
    return (
        <div className="animate-pulse rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-5 py-4 space-y-2">
                <div className="h-4 w-36 rounded bg-slate-200" />
                <div className="h-3 w-52 rounded bg-slate-200" />
            </div>

            <div className="divide-y divide-gray-100">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-4 px-5 py-4"
                    >
                        <div className="h-9 w-9 shrink-0 rounded-full bg-slate-200" />

                        <div className="flex-1 space-y-2">
                            <div className="h-3 w-32 rounded bg-slate-200" />
                            <div className="h-3 w-24 rounded bg-slate-200" />
                        </div>

                        <div className="space-y-2">
                            <div className="h-3 w-24 rounded bg-slate-200" />
                            <div className="h-3 w-12 ml-auto rounded bg-slate-200" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GlobalListSkeleton;