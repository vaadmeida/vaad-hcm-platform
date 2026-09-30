import { FileText, Video } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import PageLoader from "@/components/common/PageLoader";

import { useOnboardingMaterials } from "@/features/onboarding/hooks/useOnboardingMaterials";

const EmployeeOnboardingMaterials = () => {
  const { data, isLoading, isError } = useOnboardingMaterials();

  const materials = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <PageLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-12">
        <ErrorState message="Failed to load onboarding materials." />
      </div>
    );
  }

  if (materials.length === 0) {
    return (
      <EmptyState
        title="No onboarding materials"
        description="There are currently no onboarding materials available."
      />
    );
  }

  return (
    <div className="space-y-3">
      {materials.map((material) => {
        const Icon = material.type === "VIDEO" ? Video : FileText;

        return (
          <div
            key={material.id}
            className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white px-5 py-4"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
              <Icon className="h-5 w-5 text-gray-500" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-gray-900">
                {material.title}
              </h3>

              {material.description && (
                <p className="mt-1 truncate text-sm text-gray-500">
                  {material.description}
                </p>
              )}
            </div>

            <span className="text-xs font-medium text-gray-500">
              {material.type}
            </span>

            <button
              type="button"
              className="cursor-pointer text-sm font-medium text-[#1078A9] hover:underline"
              onClick={() =>
                window.open(material.documentUrl, "_blank")
              }
            >
              View
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default EmployeeOnboardingMaterials;