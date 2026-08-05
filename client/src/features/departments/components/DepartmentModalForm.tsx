import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { FolderPlus } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import ButtonLoader from "@/components/common/ButtonLoader";
import { useCreateDepartment } from "../hooks/useCreateDepartment";
import { toast } from "sonner";

interface DepartmentForm {
    name: string,
    description: string
}

const initialform: DepartmentForm = {
    name: "",
    description: ""
}

const DepartmentModalForm = () => {
    const [open, setOpen] = useState(false);
    const user = useAuthStore((state) => state.user)
    const [form, setform] = useState<DepartmentForm>(initialform)
    const { isPending, mutateAsync } = useCreateDepartment()


    const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

        setform((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            await mutateAsync(form)
            toast.success("Departments Created Succesfully")
            setform(initialform)
            setOpen(false)
        } catch (error) {
            console.error(error)
            toast.error("Failed to create employee");
        }
    }



    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {user?.role === "admin" && (
                    <Button className="h-9 gap-2 rounded-md px-3 text-sm text-white">
                        <FolderPlus className="h-4 w-4" />
                        Create Department
                    </Button>
                )}
            </DialogTrigger>

          <DialogContent className="w-[95vw] max-w-xl bg-white max-h-[90vh] overflow-y-hidden">
                <DialogHeader>
                    <DialogTitle className="text-base">
                        Add Department
                    </DialogTitle>
                </DialogHeader>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    {/* Department Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Department Name
                        </Label>

                        <Input
                            id="name"
                            name="name"
                            onChange={handleChange}
                            className="h-10 rounded-lg border border-gray-200 bg-white px-3 shadow-sm focus:border-primary focus:ring-1 focus:ring-secondary/20"
                            placeholder="e.g. Technology & Products"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">
                            Description
                        </Label>

                        <textarea
                            id="description"
                            name="description"
                            onChange={handleChange}
                            rows={4}
                            placeholder="Briefly describe this department..."
                            className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm outline-none placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-secondary/20"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 border-t border-gray-300 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="h-9 rounded-md px-4 text-sm text-black"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={isPending}
                            className="h-9 rounded-md px-4 text-sm text-white"
                        >
                            {isPending ? (
                                <ButtonLoader text="Creating..." />
                            ) : (
                                "Create Department"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default DepartmentModalForm
