import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { OnboardingMaterial } from "../types/onboarding.types";
import { useDeleteOnboardingMaterial } from "../hooks/useDeleteOnboardingMaterial";

interface DeleteOnboardingMaterialModalProps {
  material: OnboardingMaterial | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeleteOnboardingMaterialModal = ({
  material,
  open,
  onOpenChange,
}: DeleteOnboardingMaterialModalProps) => {
  const deleteMaterial = useDeleteOnboardingMaterial();

  if (!material) {
    return null;
  }

  const handleDelete = () => {
    deleteMaterial.mutate(material.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Delete onboarding material?</DialogTitle>

          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-medium text-gray-900">
              {material.title}
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={() => onOpenChange(false)}
            disabled={deleteMaterial.isPending}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            className="cursor-pointer"
            onClick={handleDelete}
            disabled={deleteMaterial.isPending}
          >
            {deleteMaterial.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}

            {deleteMaterial.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteOnboardingMaterialModal;