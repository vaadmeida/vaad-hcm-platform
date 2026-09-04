const Documents = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-foreground">
                        Employee Documents
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        View, manage, and track employee documents.
                    </p>
                </div>

                <button className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90">
                    + Upload Document
                </button>
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
                            <h3 className="mt-2 text-2xl font-bold">
                                124
                            </h3>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            📄
                        </div>
                    </div>
                </div>

                {/* Valid */}
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-emerald-700">
                                Valid
                            </p>
                            <h3 className="mt-2 text-2xl font-bold text-emerald-700">
                                108
                            </h3>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                            ✓
                        </div>
                    </div>
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
                </div>

                {/* Expired */}
                <div className="rounded-xl border border-red-100 bg-red-50/50 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-red-700">
                                Expired
                            </p>
                            <h3 className="mt-2 text-2xl font-bold text-red-700">
                                7
                            </h3>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600">
                            !
                        </div>
                    </div>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="rounded-xl border bg-card p-4 shadow-sm">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search employee or document..."
                            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                    </div>

                    <select className="rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary">
                        <option>All Document Types</option>
                        <option>National ID</option>
                        <option>Passport</option>
                        <option>Employment Contract</option>
                        <option>Certificate</option>
                    </select>

                    <select className="rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary">
                        <option>All Categories</option>
                        <option>Identity</option>
                        <option>Employment</option>
                        <option>Education</option>
                        <option>Compliance</option>
                    </select>

                    <select className="rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary">
                        <option>All Status</option>
                        <option>Valid</option>
                        <option>Expiring Soon</option>
                        <option>Expired</option>
                    </select>
                </div>
            </div>

            {/* Documents Table */}
            <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                {/* Table Header */}
                <div className="hidden grid-cols-7 gap-4 border-b bg-muted/30 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:grid">
                    <span>Employee</span>
                    <span>Document</span>
                    <span>Type</span>
                    <span>Uploaded</span>
                    <span>Expiry</span>
                    <span>Status</span>
                    <span className="text-right">Actions</span>
                </div>

                {/* Document Row */}
                <div className="grid grid-cols-1 gap-4 border-b px-5 py-4 md:grid-cols-7 md:items-center">
                    <div>
                        <p className="text-sm font-medium">
                            John Doe
                        </p>
                        <p className="text-xs text-muted-foreground">
                            EMP-001
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            📄
                        </div>

                        <span className="text-sm font-medium">
                            Passport
                        </span>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        Identity
                    </p>

                    <p className="text-sm text-muted-foreground">
                        Sep 2, 2026
                    </p>

                    <p className="text-sm text-muted-foreground">
                        Dec 15, 2027
                    </p>

                    <div>
                        <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                            Valid
                        </span>
                    </div>

                    <div className="flex gap-2 md:justify-end">
                        <button className="rounded-md px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/10">
                            View
                        </button>

                        <button className="rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted">
                            More
                        </button>
                    </div>
                </div>

                {/* Expiring Row */}
                <div className="grid grid-cols-1 gap-4 border-b px-5 py-4 md:grid-cols-7 md:items-center">
                    <div>
                        <p className="text-sm font-medium">
                            Sarah Williams
                        </p>
                        <p className="text-xs text-muted-foreground">
                            EMP-014
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            📄
                        </div>

                        <span className="text-sm font-medium">
                            Work Permit
                        </span>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        Compliance
                    </p>

                    <p className="text-sm text-muted-foreground">
                        Aug 18, 2026
                    </p>

                    <p className="text-sm font-medium text-amber-600">
                        Sep 10, 2026
                    </p>

                    <div>
                        <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                            Expiring Soon
                        </span>
                    </div>

                    <div className="flex gap-2 md:justify-end">
                        <button className="rounded-md px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/10">
                            View
                        </button>

                        <button className="rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted">
                            More
                        </button>
                    </div>
                </div>

                {/* Empty State */}
                <div className="hidden px-5 py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        📄
                    </div>

                    <h3 className="mt-4 text-sm font-semibold">
                        No documents found
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Try adjusting your search or filters.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Documents;