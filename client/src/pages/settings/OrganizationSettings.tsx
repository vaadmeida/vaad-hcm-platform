import { useGetOrganization } from "@/features/settings/hooks/useGetOrganization";
import { useUpdateOrganization } from "@/features/settings/hooks/useUpdateOrganization";
import type { UpdateOrganizationPayload } from "@/features/settings/types/settings.types";
import { useState } from "react";
import { toast } from "sonner";


const OrganizationSettings = () => {
    const { data: organization, isLoading } = useGetOrganization();

    const { mutate: updateOrganization, isPending} = useUpdateOrganization();

    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState<UpdateOrganizationPayload>({
        name: "",
        industry: "",
        email: "",
        company_size: "",
        phone: "",
        website: "",
        street_address: "",
        city: "",
        state: "",
        country: "",
    });

    const handleEdit = () => {
        if (!organization?.data) return;

        const company = organization.data;

        setFormData({
            name: company.name || "",
            industry: company.industry || "",
            email: company.email || "",
            company_size: company.company_size || "",
            phone: company.phone || "",
            website: company.website || "",
            street_address: company.street_address || "",
            city: company.city || "",
            state: company.state || "",
            country: company.country || "",
        });

        setIsEditing(true);
    };

    const handleChange = ( e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        updateOrganization(formData, {
            onSuccess: () => {
                setIsEditing(false);
                toast.success("Organization settings updated successfully");
            },
            onError: () => {
                toast.error(
                    "Failed to update organization settings. Please try again."
                );
            },
        });
    };

    if (isLoading) {
        return (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
                <p className="text-sm text-gray-500">
                    Loading organization settings...
                </p>
            </section>
        );
    }

    if (!organization?.data) {
        return (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
                <p className="text-sm text-gray-500">
                    Unable to load organization settings.
                </p>
            </section>
        );
    }

    const company = organization.data;

    return (
        <section className="rounded-xl border border-gray-200 bg-white">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        Organization Settings
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage your organization's information and preferences.
                    </p>
                </div>

                {!isEditing && (
                    <button
                        type="button"
                        onClick={handleEdit}
                        className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 cursor-pointer"
                    >
                        Edit Organization
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit}>
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
                                    name="name"
                                    value={
                                        isEditing
                                            ? formData.name
                                            : company.name || ""
                                    }
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>

                            {/* Industry */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Industry
                                </label>

                                <input
                                    type="text"
                                    name="industry"
                                    value={
                                        isEditing
                                            ? formData.industry
                                            : company.industry || ""
                                    }
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="e.g. Technology"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>

                            {/* Company Email */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Company Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={
                                        isEditing
                                            ? formData.email
                                            : company.email || ""
                                    }
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="company@example.com"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>

                            {/* Company Size */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Company Size
                                </label>

                                <select
                                    name="company_size"
                                    value={
                                        isEditing
                                            ? formData.company_size
                                            : company.company_size || ""
                                    }
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
                                >
                                    <option value="">
                                        Select company size
                                    </option>
                                    <option value="1-10">
                                        1–10 employees
                                    </option>
                                    <option value="11-50">
                                        11–50 employees
                                    </option>
                                    <option value="51-200">
                                        51–200 employees
                                    </option>
                                    <option value="201-500">
                                        201–500 employees
                                    </option>
                                    <option value="501-1000">
                                        501–1,000 employees
                                    </option>
                                    <option value="1000+">
                                        1,000+ employees
                                    </option>
                                </select>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Phone Number
                                </label>

                                <input
                                    type="tel"
                                    name="phone"
                                    value={
                                        isEditing
                                            ? formData.phone
                                            : company.phone || ""
                                    }
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="Enter company phone number"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>

                            {/* Website */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Website
                                </label>

                                <input
                                    type="url"
                                    name="website"
                                    value={
                                        isEditing
                                            ? formData.website
                                            : company.website || ""
                                    }
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="https://example.com"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
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
                                Your organization's registered or office
                                address.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            {/* Street Address */}
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Street Address
                                </label>

                                <input
                                    type="text"
                                    name="street_address"
                                    value={
                                        isEditing
                                            ? formData.street_address
                                            : company.street_address || ""
                                    }
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="Enter street address"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>

                            {/* City */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    City
                                </label>

                                <input
                                    type="text"
                                    name="city"
                                    value={
                                        isEditing
                                            ? formData.city
                                            : company.city || ""
                                    }
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="Enter city"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>

                            {/* State */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    State
                                </label>

                                <input
                                    type="text"
                                    name="state"
                                    value={
                                        isEditing
                                            ? formData.state
                                            : company.state || ""
                                    }
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="Enter state"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>

                            {/* Country */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Country
                                </label>

                                <input
                                    type="text"
                                    name="country"
                                    value={
                                        isEditing
                                            ? formData.country
                                            : company.country || ""
                                    }
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="Enter country"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                {isEditing && (
                    <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isPending}
                            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isPending ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                )}
            </form>
        </section>
    );
};

export default OrganizationSettings;