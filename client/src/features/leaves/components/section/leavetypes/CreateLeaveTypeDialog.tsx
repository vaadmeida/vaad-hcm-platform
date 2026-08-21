import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCreateLeaveType } from "@/features/leaves/hooks/useCreatLeaveTypes";
import ButtonLoader from "@/components/common/ButtonLoader";
import { toast } from "sonner";
import axios from "axios";

const CreateLeaveTypeDialog = () => {
    const [open, setOpen] = useState(false);

    const [isPaid, setIsPaid] = useState(false);
    const [requiresDocument, setRequiresDocument] = useState(false);
    const [carriesOver, setCarriesOver] = useState(false);

    const { mutateAsync: createLeaveType, isPending } = useCreateLeaveType();

    const [name, setName] = useState("");
    const [days, setDays] = useState("");
    const [maxCarryoverDays, setMaxCarryoverDays] = useState("");


    const handleSubmit = async () => {
        try {
            const payload = {
                name: name.trim(),
                default_days_per_year: days ? Number(days) : null,
                requires_document: requiresDocument,
                is_paid: isPaid,
                carries_over: carriesOver,
                max_carryover_days: carriesOver
                    ? Number(maxCarryoverDays || 0)
                    : 0,
            };


            await createLeaveType(payload);

            toast.success("Leave type created successfully");
            setOpen(false);

            setName("");
            setDays("");
            setMaxCarryoverDays("");
            setIsPaid(true);
            setRequiresDocument(false);
            setCarriesOver(false);

        } catch (error) {
            if (axios.isAxiosError(error)) {
                const response = error.response?.data;

                if (response?.code === "DUPLICATE_NAME") {
                    toast.error("A leave type with this name already exists.");
                    return;
                }

                toast.error(response?.message || "Failed to create leave type");
                return;
            }

            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="h-9 gap-2 rounded-md bg-[#1078A9] px-4 text-sm font-medium text-white hover:bg-[#0d668f]">
                    <Plus className="h-4 w-4" />
                    Add Leave Type
                </Button>
            </DialogTrigger>

            <DialogContent className="bg-white sm:max-w-120">
                <DialogHeader className="border-b border-gray-100 pb-3">
                    <DialogTitle className="text-base font-semibold text-gray-900">
                        Add Leave Type
                    </DialogTitle>

                    <DialogDescription className="text-xs text-gray-500">
                        Create and configure a new employee leave type.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-1">
                    {/* Basic Information */}
                    <section>
                        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Basic Information
                        </h3>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label
                                    htmlFor="name"
                                    className="text-xs font-medium text-gray-700"
                                >
                                    Leave Type Name
                                    <span className="ml-1 text-red-500">*</span>
                                </Label>

                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g'. Annual Leave"
                                    className="h-8 text-sm"
                                />
                            </div>

                            <div className="space-y-1">
                                <Label
                                    htmlFor="days"
                                    className="text-xs font-medium text-gray-700"
                                >
                                    Days Per Year
                                    <span className="ml-1 text-red-500">*</span>
                                </Label>

                                <Input
                                    id="days"
                                    value={days}
                                    onChange={(e) => setDays(e.target.value)}
                                    type="number"
                                    min={0}
                                    placeholder="e.g. 21"
                                    className="h-8 text-sm"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Leave Policy */}
                    <section>
                        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Leave Policy
                        </h3>

                        <div className="divide-y rounded-lg border border-gray-200">
                            {/* Paid Leave */}
                            <div className="flex min-h-10 items-center justify-between px-3 py-2">
                                <div className="flex min-w-0 items-center gap-2">
                                    <span className="text-sm font-medium text-gray-900">
                                        Paid Leave
                                    </span>

                                    <span className="text-xs text-gray-400">
                                        Employee is paid
                                    </span>
                                </div>

                                <Switch
                                    checked={isPaid}
                                    onCheckedChange={(checked) => {
                                        setIsPaid(checked);

                                        if (!checked) {
                                            setCarriesOver(false);
                                            setMaxCarryoverDays("");
                                        }
                                    }}
                                    className="shrink-0 data-[state=checked]:bg-[#1078A9] data-[state=unchecked]:bg-gray-300"
                                />
                            </div>

                            {/* Requires Document */}
                            <div className="flex min-h-10 items-center justify-between px-3 py-2">
                                <div className="flex min-w-0 items-center gap-2">
                                    <span className="text-sm font-medium text-gray-900">
                                        Requires Document
                                    </span>

                                    <span className="text-xs text-gray-400">
                                        Supporting document
                                    </span>
                                </div>

                                <Switch
                                    checked={requiresDocument}
                                    onCheckedChange={setRequiresDocument}
                                    className="shrink-0 data-[state=checked]:bg-[#1078A9] data-[state=unchecked]:bg-gray-300"
                                />
                            </div>

                            {/* Allow Carry Over */}
                            <div className="flex min-h-10 items-center justify-between px-3 py-2">
                                <div className="flex min-w-0 items-center gap-2">
                                    <span className="text-sm font-medium text-gray-900">
                                        Allow Carry Over
                                    </span>

                                    <span className="text-xs text-gray-400">
                                        Unused days
                                    </span>
                                </div>
                                <Switch
                                    checked={carriesOver}
                                    disabled={!isPaid}
                                    onCheckedChange={setCarriesOver}
                                    className="shrink-0 data-[state=checked]:bg-[#1078A9] data-[state=unchecked]:bg-gray-300"
                                />
                            </div>

                            {/* Maximum Carry Over */}
                            {carriesOver && (
                                <div className="flex items-center justify-between bg-gray-50 px-3 py-2">
                                    <div className="flex min-w-0 items-center gap-2">
                                        <span className="text-sm font-medium text-gray-900">
                                            Maximum Carry Over
                                        </span>

                                        <span className="text-xs text-gray-400">
                                            Days allowed
                                        </span>
                                    </div>

                                    <Input
                                        id="carryover"
                                        type="number"
                                        min={0}
                                        value={maxCarryoverDays}
                                        onChange={(e) => setMaxCarryoverDays(e.target.value)}
                                        placeholder="5"
                                        className="h-8 w-20 shrink-0 bg-white text-sm"
                                    />
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <DialogFooter className="border-t border-gray-100 pt-3">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-8 px-3 text-sm"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        className="h-8 bg-[#1078A9] px-3 text-sm text-white hover:bg-[#0d668f]"
                    >
                        {isPending ? (
                            <ButtonLoader text="Creating..." />
                        ) : (
                            "Create Leave Type"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CreateLeaveTypeDialog;