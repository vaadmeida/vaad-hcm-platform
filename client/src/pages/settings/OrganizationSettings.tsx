const OrganizationSettings = () => {
    return (
        <section className="rounded-xl border border-gray-200 bg-white">
            {/* Header */}
            <div className="border-b border-gray-200 px-6 py-5">
                <h2 className="text-lg font-semibold text-gray-900">
                    Organization Settings
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Manage your organization's information and preferences.
                </p>
            </div>

            {/* Form */}
            <div className="space-y-8 p-6">
                {/* Company Information */}
                <div>
                    <div className="mb-5">
                        <h3 className="text-sm font-semibold text-gray-900">
                            Company Information
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                            Basic information about your organization.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {/* Company Name */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Company Name
                            </label>

                            <input
                                type="text"
                                defaultValue="VAAD MEDIA LTD"
                                placeholder="Enter company name"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                            />
                        </div>

                        {/* Industry */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Industry
                            </label>

                            <input
                                type="text"
                                defaultValue="Media Agency"
                                placeholder="e.g. Technology"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                            />
                        </div>

                        {/* Company Email */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Company Email
                            </label>

                            <input
                                type="email"
                                defaultValue="admin@vaadhr.com"
                                placeholder="company@example.com"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                            />
                        </div>

                        {/* Company Size */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Company Size
                            </label>

                            <select
                                defaultValue="11-50"
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                            >
                                <option value="">Select company size</option>
                                <option value="1-10">1–10 employees</option>
                                <option value="11-50">11–50 employees</option>
                                <option value="51-200">51–200 employees</option>
                                <option value="201-500">201–500 employees</option>
                                <option value="501-1000">501–1,000 employees</option>
                                <option value="1000+">1,000+ employees</option>
                            </select>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>

                            <input
                                type="tel"
                                defaultValue="08000000000"
                                placeholder="Enter company phone number"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                            />
                        </div>

                        {/* Website */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Website
                            </label>

                            <input
                                type="url"
                                placeholder="https://example.com"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                            />
                        </div>
                    </div>
                </div>

                {/* Company Address */}
                <div className="border-t border-gray-100 pt-8">
                    <div className="mb-5">
                        <h3 className="text-sm font-semibold text-gray-900">
                            Company Address
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                            Your organization's registered or office address.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {/* Address */}
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Street Address
                            </label>

                            <input
                                type="text"
                                placeholder="Enter street address"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                            />
                        </div>

                        {/* City */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                City
                            </label>

                            <input
                                type="text"
                                placeholder="Enter city"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                            />
                        </div>

                        {/* State */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                State
                            </label>

                            <input
                                type="text"
                                placeholder="Enter state"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                            />
                        </div>

                        {/* Country */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Country
                            </label>

                            <input
                                type="text"
                                defaultValue="Nigeria"
                                placeholder="Enter country"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
                <button
                    type="button"
                    className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                    Cancel
                </button>

                <button
                    type="button"
                    className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                    Save Changes
                </button>
            </div>
        </section>
    );
};

export default OrganizationSettings;