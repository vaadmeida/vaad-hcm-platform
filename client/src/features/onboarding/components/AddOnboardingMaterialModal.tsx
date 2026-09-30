import { useState } from "react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { useCreateOnboardingMaterial } from "../hooks/useCreateOnboardingMaterial";
import type { OnboardingMaterialType } from "../types/onboarding.types";

interface AddOnboardingMaterialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddOnboardingMaterialModal = ({
  open,
  onOpenChange,
}: AddOnboardingMaterialModalProps) => {
  const createMaterial = useCreateOnboardingMaterial();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] =
    useState<OnboardingMaterialType>("DOCUMENT");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) return;

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("type", type);
    formData.append("document", file);

    createMaterial.mutate(formData, {
      onSuccess: () => {
        setTitle("");
        setDescription("");
        setType("DOCUMENT");
        setFile(null);
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle>Add Onboarding Material</DialogTitle>

          <DialogDescription>
            Add a document or video that employees can access during
            onboarding.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>

            <Input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. About VAAD"
              disabled={createMaterial.isPending}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>

            <Textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Brief description of this material"
              rows={3}
              className="resize-none"
              disabled={createMaterial.isPending}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>

              <Select
                value={type}
                onValueChange={(value) =>
                  setType(value as OnboardingMaterialType)
                }
                disabled={createMaterial.isPending}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="DOCUMENT">Document</SelectItem>
                  <SelectItem value="VIDEO">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="document">File</Label>

              <Input
                id="document"
                type="file"
                accept={
                  type === "VIDEO"
                    ? "video/*"
                    : ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                }
                onChange={(event) =>
                  setFile(event.target.files?.[0] ?? null)
                }
                disabled={createMaterial.isPending}
                className="cursor-pointer"
                required
              />

              <p className="text-xs text-gray-500">
                Upload the document or video employees should access.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => onOpenChange(false)}
              disabled={createMaterial.isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="cursor-pointer text-white"
              disabled={createMaterial.isPending || !file}
            >
              {createMaterial.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}

              {createMaterial.isPending ? "Adding..." : "Add Material"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddOnboardingMaterialModal;