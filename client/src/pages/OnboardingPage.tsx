import { useState } from "react";

import {
  FileText,
  MoreHorizontal,
  Pencil,
  Trash2,
  Video,
} from "lucide-react";

import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import PageLoader from "@/components/common/PageLoader";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import DeleteOnboardingMaterialModal from "@/features/onboarding/components/DeleteOnboardingMaterialModal";
import EditOnboardingMaterialModal from "@/features/onboarding/components/EditOnboardingMaterialModal";
import OnboardingToolBar from "@/features/onboarding/components/OnboardingToolBar";
import { useOnboardingMaterials } from "@/features/onboarding/hooks/useOnboardingMaterials";
import type { OnboardingMaterial } from "@/features/onboarding/types/onboarding.types";

const OnboardingPage = () => {
  const { data, isLoading, isError } = useOnboardingMaterials();

  const [editingMaterial, setEditingMaterial] =
    useState<OnboardingMaterial | null>(null);

  const [deletingMaterial, setDeletingMaterial] =
    useState<OnboardingMaterial | null>(null);

  const materials = data?.data ?? [];

  return (
    <>
      <div className="space-y-6">
        <OnboardingToolBar />

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <PageLoader />
          </div>
        )}

        {isError && (
          <div className="flex items-center justify-center py-12">
            <ErrorState message="Failed to load onboarding materials." />
          </div>
        )}

        {!isLoading && !isError && materials.length === 0 && (
          <EmptyState
            title="No onboarding materials"
            description="Add documents or videos for employees to access during onboarding."
          />
        )}

        {!isLoading && !isError && materials.length > 0 && (
          <div className="space-y-3">
            {materials.map((material) => {
              const Icon =
                material.type === "VIDEO" ? Video : FileText;

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

                  <Button
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer text-sm font-medium text-[#1078A9]"
                    onClick={() =>
                      window.open(material.documentUrl, "_blank")
                    }
                  >
                    View
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 cursor-pointer bg-white"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">
                          Open actions
                        </span>
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() =>
                          setEditingMaterial(material)
                        }
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="cursor-pointer text-red-600 focus:text-red-600"
                        onClick={() =>
                          setDeletingMaterial(material)
                        }
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <EditOnboardingMaterialModal
        material={editingMaterial}
        open={editingMaterial !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingMaterial(null);
          }
        }}
      />

      <DeleteOnboardingMaterialModal
        material={deletingMaterial}
        open={deletingMaterial !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingMaterial(null);
          }
        }}
      />
    </>
  );
};

export default OnboardingPage;