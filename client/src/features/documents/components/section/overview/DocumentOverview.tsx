const DocumentOverview = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl font-semibold text-foreground">
                    Document Overview
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Monitor employee document status, compliance, and upcoming expirations.
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total */}
                <div className="rounded-xl border bg-card p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Total Documents
                            </p>
                            <h3 className="mt-2 text-2xl font-bold text-foreground">
                                124
                            </h3>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            📄
                        </div>
                    </div>

                    <p className="mt-3 text-xs text-muted-foreground">
                        Across all employees
                    </p>
                </div>

                {/* Valid */}
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-emerald-700">
                                Valid Documents
                            </p>
                            <h3 className="mt-2 text-2xl font-bold text-emerald-700">
                                108
                            </h3>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                            ✓
                        </div>
                    </div>

                    <p className="mt-3 text-xs text-emerald-600">
                        87% of total documents
                    </p>
                </div>

                {/* Expiring */}
                <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-amber-700">
                                Expiring Soon
                            </p>
                            <h3 className="mt-2 text-2xl font-bold text-amber-700">
                                9
                            </h3>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                            !
                        </div>
                    </div>

                    <p className="mt-3 text-xs text-amber-600">
                        Requires attention
                    </p>
                </div>

                {/* Missing */}
                <div className="rounded-xl border border-red-100 bg-red-50/50 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-red-700">
                                Missing Documents
                            </p>
                            <h3 className="mt-2 text-2xl font-bold text-red-700">
                                7
                            </h3>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600">
                            !
                        </div>
                    </div>

                    <p className="mt-3 text-xs text-red-600">
                        Required documents missing
                    </p>
                </div>
            </div>

            {/* Main Sections */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Expiring Documents */}
                <div className="rounded-xl border bg-card shadow-sm">
                    <div className="flex items-center justify-between border-b px-5 py-4">
                        <div>
                            <h3 className="font-semibold text-foreground">
                                Expiring Documents
                            </h3>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Documents that require attention soon.
                            </p>
                        </div>

                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                            9 Expiring
                        </span>
                    </div>

                    <div className="divide-y">
                        {/* Document Item */}
                        <div className="flex items-center justify-between px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                                    📄
                                </div>

                                <div>
                                    <p className="text-sm font-medium">
                                        John Doe
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Passport
                                    </p>
                                </div>
                            </div>

                            <span className="text-xs font-medium text-amber-600">
                                Expires in 12 days
                            </span>
                        </div>

                        <div className="flex items-center justify-between px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                                    📄
                                </div>

                                <div>
                                    <p className="text-sm font-medium">
                                        Sarah Williams
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Work Permit
                                    </p>
                                </div>
                            </div>

                            <span className="text-xs font-medium text-red-600">
                                Expires in 5 days
                            </span>
                        </div>
                    </div>
                </div>

                {/* Missing Documents */}
                <div className="rounded-xl border bg-card shadow-sm">
                    <div className="flex items-center justify-between border-b px-5 py-4">
                        <div>
                            <h3 className="font-semibold text-foreground">
                                Missing Required Documents
                            </h3>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Employees with incomplete requirements.
                            </p>
                        </div>

                        <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                            7 Missing
                        </span>
                    </div>

                    <div className="divide-y">
                        <div className="flex items-center justify-between px-5 py-4">
                            <div>
                                <p className="text-sm font-medium">
                                    Michael Johnson
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    National ID
                                </p>
                            </div>

                            <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">
                                Missing
                            </span>
                        </div>

                        <div className="flex items-center justify-between px-5 py-4">
                            <div>
                                <p className="text-sm font-medium">
                                    David Anderson
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Employment Contract
                                </p>
                            </div>

                            <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">
                                Missing
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Documents */}
            <div className="rounded-xl border bg-card shadow-sm">
                <div className="flex items-center justify-between border-b px-5 py-4">
                    <div>
                        <h3 className="font-semibold text-foreground">
                            Recent Documents
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Recently uploaded or updated employee documents.
                        </p>
                    </div>

                    <button className="text-sm font-medium text-primary hover:underline">
                        View All
                    </button>
                </div>

                <div className="divide-y">
                    <div className="flex items-center justify-between px-5 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                📄
                            </div>

                            <div>
                                <p className="text-sm font-medium">
                                    Employment Contract
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    John Doe • Uploaded today
                                </p>
                            </div>
                        </div>

                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
                            Valid
                        </span>
                    </div>

                    <div className="flex items-center justify-between px-5 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                📄
                            </div>

                            <div>
                                <p className="text-sm font-medium">
                                    National ID
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Sarah Williams • Updated yesterday
                                </p>
                            </div>
                        </div>

                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
                            Valid
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentOverview;