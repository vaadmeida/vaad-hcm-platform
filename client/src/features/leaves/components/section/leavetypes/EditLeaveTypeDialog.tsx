
import { useState } from "react";
import { Pencil, Settings2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

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

import ButtonLoader from "@/components/common/ButtonLoader";
import { useUpdateLeaveTypes } from "@/features/leaves/hooks/useUpdateLeaveTypes";
import type { LeaveType } from "@/features/leaves/types/leave.types";

interface EditLeaveTypeDialogProps {
    leaveType: LeaveType;
}

const EditLeaveTypeDialog = ({
    leaveType,
}: EditLeaveTypeDialogProps) => {
    const [open, setOpen] = useState(false);

    const [name, setName] = useState(leaveType.name);
    const [days, setDays] = useState(
        String(leaveType.default_days_per_year ?? "")
    );
    const [maxCarryoverDays, setMaxCarryoverDays] = useState(
        String(leaveType.max_carryover_days ?? "")
    );

    const [isPaid, setIsPaid] = useState(leaveType.is_paid);
    const [requiresDocument, setRequiresDocument] = useState(
        leaveType.requires_document
    );
    const [carriesOver, setCarriesOver] = useState(
        leaveType.carries_over
    );

    const {
        mutateAsync: updateLeaveType,
        isPending,
    } = useUpdateLeaveTypes();

    const handleSubmit = async () => {
        if (!name.trim()) {
            toast.error("Leave type name is required.");
            return;
        }

        if (!days || Number(days) < 0) {
            toast.error("Please enter valid days per year.");
            return;
        }

        if (carriesOver && Number(maxCarryoverDays) < 0) {
            toast.error("Maximum carry over days cannot be negative.");
            return;
        }

        try {
            await updateLeaveType({
                id: leaveType.id,
                name: name.trim(),
                default_days_per_year: Number(days),
                requires_document: requiresDocument,
                is_paid: isPaid,
                carries_over: carriesOver,
                max_carryover_days: carriesOver
                    ? Number(maxCarryoverDays || 0)
                    : 0,
            });

            toast.success("Leave type updated successfully.");
            setOpen(false);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const response = error.response?.data;

                if (
                    response?.code === "DUPLICATE_LEAVE_TYPE" ||
                    response?.code === "DUPLICATE_NAME"
                ) {
                    toast.error(
                        "A leave type with this name already exists."
                    );
                    return;
                }

                toast.error(
                    response?.message || "Failed to update leave type."
                );
                return;
            }

            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    type="button"
                    title="Edit leave type"
                    aria-label="Edit leave type"
                    className="cursor-pointer rounded-md p-2 text-[#1078A9] transition-colors hover:bg-sky-50"
                >
                    <Pencil size={17} />
                </button>
            </DialogTrigger>

            <DialogContent className="max-w-105 gap-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-0 text-slate-900 opacity-100 shadow-2xl">

                {/* Header */}
                <DialogHeader className="border-b border-slate-100 bg-white px-5 py-3.5">
                    <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-[#1078A9]">
                            <Settings2 size={18} />
                        </div>

                        <div className="space-y-0.5">
                            <DialogTitle className="text-sm font-semibold text-slate-900">
                                Edit Leave Type
                            </DialogTitle>

                            <DialogDescription className="text-xs text-slate-500">
                                Update leave details and policy settings.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Form Content */}
                <div className="space-y-4 bg-white px-5 py-4">

                    {/* Basic Information */}
                    <section>
                        <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                            Basic Information
                        </h3>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="edit-name"
                                    className="text-xs font-medium text-slate-700"
                                >
                                    Leave Type Name
                                    <span className="ml-1 text-red-500">*</span>
                                </Label>

                                <Input
                                    id="edit-name"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    placeholder="e.g. Annual Leave"
                                    className="h-9 bg-white text-xs"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="edit-days"
                                    className="text-xs font-medium text-slate-700"
                                >
                                    Days Per Year
                                    <span className="ml-1 text-red-500">*</span>
                                </Label>

                                <Input
                                    id="edit-days"
                                    type="number"
                                    min={0}
                                    value={days}
                                    onChange={(e) =>
                                        setDays(e.target.value)
                                    }
                                    placeholder="e.g. 21"
                                    className="h-9 bg-white text-xs"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Leave Policy */}
                    <section>
                        <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                            Leave Policy
                        </h3>

                        <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">

                            {/* Paid Leave */}
                            <div className="flex items-center justify-between gap-3 px-3 py-2">
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-slate-800">
                                        Paid Leave
                                    </p>
                                    <p className="text-[11px] text-slate-400">
                                        Employee receives payment
                                    </p>
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
                                    className="shrink-0 data-[state=checked]:bg-[#1078A9] data-[state=unchecked]:bg-slate-300"
                                />
                            </div>

                            {/* Requires Document */}
                            <div className="flex items-center justify-between gap-3 px-3 py-2">
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-slate-800">
                                        Requires Document
                                    </p>
                                    <p className="text-[11px] text-slate-400">
                                        Supporting document required
                                    </p>
                                </div>

                                <Switch
                                    checked={requiresDocument}
                                    onCheckedChange={setRequiresDocument}
                                    className="shrink-0 data-[state=checked]:bg-[#1078A9] data-[state=unchecked]:bg-slate-300"
                                />
                            </div>

                            {/* Allow Carry Over */}
                            <div className="flex items-center justify-between gap-3 px-3 py-2">
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-slate-800">
                                        Allow Carry Over
                                    </p>
                                    <p className="text-[11px] text-slate-400">
                                        Carry unused leave days forward
                                    </p>
                                </div>

                                <Switch
                                    checked={carriesOver}
                                    disabled={!isPaid}
                                    onCheckedChange={setCarriesOver}
                                    className="shrink-0 data-[state=checked]:bg-[#1078A9] data-[state=unchecked]:bg-slate-300"
                                />
                            </div>

                            {/* Maximum Carry Over */}
                            {carriesOver && (
                                <div className="flex items-center justify-between gap-3 bg-slate-50 px-3 py-2">
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-slate-800">
                                            Maximum Carry Over
                                        </p>
                                        <p className="text-[11px] text-slate-400">
                                            Maximum days allowed
                                        </p>
                                    </div>

                                    <Input
                                        id="edit-carryover"
                                        type="number"
                                        min={0}
                                        value={maxCarryoverDays}
                                        onChange={(e) =>
                                            setMaxCarryoverDays(
                                                e.target.value
                                            )
                                        }
                                        placeholder="5"
                                        className="h-8 w-20 shrink-0 bg-white text-xs"
                                    />
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <DialogFooter className="flex-row justify-end gap-2 border-t border-slate-100 bg-white px-8 py-6">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isPending}
                        className="h-8 px-3 text-xs"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isPending || !name.trim() || !days}
                        className="h-8 bg-[#1078A9] px-3 text-xs text-white hover:bg-[#0d668f]"
                    >
                        {isPending ? (
                            <ButtonLoader text="Saving..." />
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditLeaveTypeDialog;
