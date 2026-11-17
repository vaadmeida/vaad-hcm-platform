const GlobalStatsOverview = () => {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-pulse">
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
    );
};

export default GlobalStatsOverview;