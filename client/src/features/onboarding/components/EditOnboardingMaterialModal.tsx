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


import type {
    OnboardingMaterial,
    OnboardingMaterialType,
} from "../types/onboarding.types";
import { useUpdateOnboardingMaterial } from "../hooks/useUpdateOnboardingMaterial";

interface EditOnboardingMaterialModalProps {
    material: OnboardingMaterial | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface EditFormProps {
    material: OnboardingMaterial;
    onOpenChange: (open: boolean) => void;
}

const EditForm = ({
    material,
    onOpenChange,
}: EditFormProps) => {
    const updateMaterial = useUpdateOnboardingMaterial();

    const [title, setTitle] = useState(material.title);
    const [description, setDescription] = useState(material.description ?? "");
    const [type, setType] = useState<OnboardingMaterialType>(material.type);;
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("type", type);


        if (file) {
            formData.append("document", file);
        }

        updateMaterial.mutate(
            {
                id: material.id,
                formData,
            },
            {
                onSuccess: () => {
                    onOpenChange(false);
                },
            }
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="e.g. About VAAD"
                    disabled={updateMaterial.isPending}
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
                    disabled={updateMaterial.isPending}
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
                        disabled={updateMaterial.isPending}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="DOCUMENT">
                                Document
                            </SelectItem>

                            <SelectItem value="VIDEO">
                                Video
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="document">Replace File</Label>

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
                        disabled={updateMaterial.isPending}
                        className="cursor-pointer"
                    />

                    <p className="text-xs text-gray-500">
                        Leave empty to keep the current file.
                    </p>
                </div>

            </div>



            <DialogFooter className="bg-secondary/20">
                <Button
                    type="button"
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => onOpenChange(false)}
                    disabled={updateMaterial.isPending}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    className="cursor-pointer text-white"
                    disabled={updateMaterial.isPending}
                >
                    {updateMaterial.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}

                    {updateMaterial.isPending
                        ? "Saving..."
                        : "Save Changes"}
                </Button>
            </DialogFooter>
        </form>
    );
};

const EditOnboardingMaterialModal = ({
    material,
    open,
    onOpenChange,
}: EditOnboardingMaterialModalProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg bg-white">
                <DialogHeader>
                    <DialogTitle>
                        Edit Onboarding Material
                    </DialogTitle>

                    <DialogDescription>
                        Update the details or replace the file for this
                        onboarding material.
                    </DialogDescription>
                </DialogHeader>

                {material && (
                    <EditForm
                        key={material.id}
                        material={material}
                        onOpenChange={onOpenChange}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};

export default EditOnboardingMaterialModal;