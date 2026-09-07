import { useRef, useState } from "react";
import { Camera, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { useGetMyProfile } from "@/features/my-profile/hooks/useGetMyProfile";
import { useUpdateMyProfile } from "@/features/settings/hooks/useUpdateMyProfile";
import { useUpdateMyProfileAvatar } from "@/features/settings/hooks/useUpdateMyProfileAvatar";
import { useAuthStore } from "@/store/auth.store";

const ProfileSettings = () => {
  const { data: profile, isLoading } = useGetMyProfile();
  const { mutate: updateProfile, isPending } = useUpdateMyProfile();
  const { mutate: updateAvatar, isPending: isUploadingAvatar } = useUpdateMyProfileAvatar();

  

  const user = useAuthStore((state) => state.user);
  const canEditJobTitle = user?.role === "admin" || user?.role === "hr";


  const [isEditing, setIsEditing] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    email: "",
    phone: "",
    job_title: "",
  });


  const handleEdit = () => {
    if (!profile) return;

    setFormData({
      first_name: profile.personal.first_name || "",
      last_name: profile.personal.last_name || "",
      middle_name: profile.personal.middle_name || "",
      email: profile.personal.email || "",
      phone: profile.personal.phone || "",
      job_title: profile.employment.job_title || "",
    });

    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file = event.target.files?.[0];

    if (!file) return;

    setAvatarError(false);

    updateAvatar(file, {
      onSuccess: () => {
        toast.success("Profile photo updated successfully");
      },
      onError: () => {
        toast.error("Failed to update profile photo. Please try again.");
      },
    });

    event.target.value = "";
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateProfile(formData, {
      onSuccess: () => {
        setIsEditing(false);
        toast.success("Profile updated successfully");
      },
      onError: () => {
        toast.error("Failed to update profile. Please try again.");
      },
    });
  };

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-500">Loading profile...</p>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-500">
          Unable to load profile information.
        </p>
      </section>
    );
  }

  const firstNameInitial = profile.personal.first_name?.trim().charAt(0) || "";

  const lastNameInitial = profile.personal.last_name?.trim().charAt(0) || "";

  const initials = `${firstNameInitial}${lastNameInitial}`.toUpperCase();

  const hasAvatar = Boolean(profile.avatar_url) && !avatarError;

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Profile Settings
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage your personal account information.
          </p>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={handleEdit}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
          >
            Edit Profile
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Profile Identity */}
        <div className="border-b border-gray-200 bg-gray-50/60 px-6 py-7">
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-gray-900">
              Profile Photo
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Your profile photo and account identity.
            </p>
          </div>

          <div className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-2xl font-semibold text-primary ring-4 ring-primary/5">
                {hasAvatar ? (
                  <img
                    src={profile.avatar_url!}
                    alt={profile.full_name}
                    className="h-full w-full object-cover"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <span>{initials}</span>
                )}
              </div>

              {isEditing && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  aria-label="Change profile photo"
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Camera size={15} />
                </button>
              )}
            </div>

            {/* Identity */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-xl font-semibold text-gray-900">
                  {profile.full_name}
                </h4>

                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                  <CheckCircle2 size={13} />
                  Active
                </span>
              </div>

              <p className="mt-1 text-sm font-medium text-primary">
                {profile.employment.job_title}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                <span>{profile.personal.email}</span>

                <span className="hidden text-gray-300 sm:inline">
                  •
                </span>

                <span>
                  Employee ID: {profile.employee_code || "N/A"}
                </span>
              </div>

              {isEditing && (
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingAvatar}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isUploadingAvatar
                      ? "Uploading..."
                      : "Change Photo"}
                  </button>

                  <span className="text-xs text-gray-400">
                    JPG, PNG or WEBP · Maximum 10MB
                  </span>
                </div>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="px-6 py-7">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900">
              Personal Information
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Keep your personal and contact details up to date.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
            {/* First Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                First Name
              </label>

              <input
                type="text"
                name="first_name"
                value={
                  isEditing
                    ? formData.first_name
                    : profile.personal.first_name || ""
                }
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Last Name
              </label>

              <input
                type="text"
                name="last_name"
                value={
                  isEditing
                    ? formData.last_name
                    : profile.personal.last_name || ""
                }
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            {/* Middle Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Middle Name
              </label>

              <input
                type="text"
                name="middle_name"
                value={
                  isEditing
                    ? formData.middle_name
                    : profile.personal.middle_name || ""
                }
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            {/* Job Title */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Job Title
              </label>
              <input
                type="text"
                name="job_title"
                value={
                  canEditJobTitle
                    ? formData.job_title
                    : profile.employment.job_title || ""
                }
                onChange={canEditJobTitle ? handleChange : undefined}
                disabled={!canEditJobTitle || !isEditing}
                className={`w-full rounded-lg border px-3.5 py-2.5 text-sm ${canEditJobTitle && isEditing
                    ? "border-gray-300 bg-white text-gray-900"
                    : "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-500"
                  }`}
              />

              <p className="mt-1.5 text-xs text-gray-400">
                Job title can only be changed by an administrator.
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={
                  isEditing
                    ? formData.email
                    : profile.personal.email || ""
                }
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
              />
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
                    : profile.personal.phone || ""
                }
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        {isEditing && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50/50 px-6 py-4">
            <p className="hidden text-xs text-gray-400 sm:block">
              Make sure your information is accurate before saving.
            </p>

            <div className="ml-auto flex gap-3">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isPending || isUploadingAvatar}
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isPending || isUploadingAvatar}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}
      </form>
    </section>
  );
};

export default ProfileSettings;