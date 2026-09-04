const DocumentTypes = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-foreground">
                        Document Types
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Define and manage document requirements for employees.
                    </p>
                </div>

                <button className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90">
                    + Create Document Type
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total Types */}
                <div className="rounded-xl border bg-card p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Total Types
                            </p>
                            <h3 className="mt-2 text-2xl font-bold text-foreground">
                                12
                            </h3>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            📋
                        </div>
                    </div>

                    <p className="mt-3 text-xs text-muted-foreground">
                        Configured document types
                    </p>
                </div>

                {/* Active */}
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-emerald-700">
                                Active Types
                            </p>
                            <h3 className="mt-2 text-2xl font-bold text-emerald-700">
                                10
                            </h3>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                            ✓
                        </div>
                    </div>

                    <p className="mt-3 text-xs text-emerald-600">
                        Currently available
                    </p>
                </div>

                {/* Required */}
                <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-700">
                                Required
                            </p>
                            <h3 className="mt-2 text-2xl font-bold text-blue-700">
                                7
                            </h3>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                            ★
                        </div>
                    </div>

                    <p className="mt-3 text-xs text-blue-600">
                        Required for employees
                    </p>
                </div>

                {/* Expiry Enabled */}
                <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-amber-700">
                                With Expiry
                            </p>
                            <h3 className="mt-2 text-2xl font-bold text-amber-700">
                                5
                            </h3>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                            ⏱
                        </div>
                    </div>

                    <p className="mt-3 text-xs text-amber-600">
                        Require expiry tracking
                    </p>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="rounded-xl border bg-card p-4 shadow-sm">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search document types..."
                            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                    </div>

                    <select className="rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary">
                        <option>All Categories</option>
                        <option>Identity</option>
                        <option>Employment</option>
                        <option>Education</option>
                        <option>Compliance</option>
                    </select>

                    <select className="rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary">
                        <option>All Status</option>
                        <option>Active</option>
                        <option>Inactive</option>
                    </select>
                </div>
            </div>

            {/* Document Types Table */}
            <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                {/* Table Header */}
                <div className="hidden grid-cols-6 gap-4 border-b bg-muted/30 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:grid">
                    <span>Document Type</span>
                    <span>Category</span>
                    <span>Required</span>
                    <span>Expiry</span>
                    <span>Status</span>
                    <span className="text-right">Actions</span>
                </div>

                {/* Row 1 */}
                <div className="grid grid-cols-1 gap-4 border-b px-5 py-4 md:grid-cols-6 md:items-center">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            📄
                        </div>

                        <div>
                            <p className="text-sm font-medium text-foreground">
                                National ID
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Government identification
                            </p>
                        </div>
                    </div>

                    <span className="text-sm text-muted-foreground">
                        Identity
                    </span>

                    <span className="inline-flex w-fit rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                        Required
                    </span>

                    <span className="text-sm text-muted-foreground">
                        No
                    </span>

                    <span className="inline-flex w-fit rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                        Active
                    </span>

                    <div className="flex gap-2 md:justify-end">
                        <button className="rounded-md px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/10">
                            Edit
                        </button>

                        <button className="rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted">
                            More
                        </button>
                    </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 gap-4 border-b px-5 py-4 md:grid-cols-6 md:items-center">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            📄
                        </div>

                        <div>
                            <p className="text-sm font-medium text-foreground">
                                Passport
                            </p>
                            <p className="text-xs text-muted-foreground">
                                International travel document
                            </p>
                        </div>
                    </div>

                    <span className="text-sm text-muted-foreground">
                        Identity
                    </span>

                    <span className="inline-flex w-fit rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                        Required
                    </span>

                    <span className="inline-flex w-fit rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                        Yes
                    </span>

                    <span className="inline-flex w-fit rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                        Active
                    </span>

                    <div className="flex gap-2 md:justify-end">
                        <button className="rounded-md px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/10">
                            Edit
                        </button>

                        <button className="rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted">
                            More
                        </button>
                    </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 gap-4 px-5 py-4 md:grid-cols-6 md:items-center">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            📄
                        </div>

                        <div>
                            <p className="text-sm font-medium text-foreground">
                                Training Certificate
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Professional training record
                            </p>
                        </div>
                    </div>

                    <span className="text-sm text-muted-foreground">
                        Education
                    </span>

                    <span className="inline-flex w-fit rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                        Optional
                    </span>

                    <span className="text-sm text-muted-foreground">
                        No
                    </span>

                    <span className="inline-flex w-fit rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                        Inactive
                    </span>

                    <div className="flex gap-2 md:justify-end">
                        <button className="rounded-md px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/10">
                            Edit
                        </button>

                        <button className="rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted">
                            More
                        </button>
                    </div>
                </div>

                {/* Empty State */}
                <div className="hidden px-5 py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        📋
                    </div>

                    <h3 className="mt-4 text-sm font-semibold text-foreground">
                        No document types found
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Try adjusting your search or filters.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DocumentTypes;