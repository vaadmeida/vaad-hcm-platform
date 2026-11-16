
import { useState } from "react";
import { Plus, Settings2 } from "lucide-react";
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

import { useCreateLeaveType } from "@/features/leaves/hooks/useCreatLeaveTypes";
import ButtonLoader from "@/components/common/ButtonLoader";

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
                <Button className="h-9 gap-2 rounded-lg bg-[#1078A9] px-4 text-sm font-medium text-white hover:bg-[#0d668f]">
                    <Plus size={15} />
                    Add Leave Type
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-105 gap-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-0 text-slate-900 opacity-100 shadow-2xl [&>button]:right-4 [&>button]:top-4">

                {/* Header */}
                <DialogHeader className="border-b border-slate-100 bg-slate-50/70 px-5 py-3.5 text-left">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-[#1078A9]">
                            <Settings2 size={16} />
                        </div>

                        <div className="space-y-0.5">
                            <DialogTitle className="text-sm font-semibold text-slate-900">
                                Create Leave Type
                            </DialogTitle>

                            <DialogDescription className="text-xs text-slate-500">
                                Configure a new employee leave policy.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Form */}
                <div className="space-y-4 px-5 py-4">

                    {/* Basic Information */}
                    <section className="space-y-2.5">
                        <h3 className="text-xs font-semibold text-slate-800">
                            Basic Information
                        </h3>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label htmlFor="name" className="text-xs text-slate-600">
                                    Leave Type Name <span className="text-red-500">*</span>
                                </Label>

                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Annual Leave"
                                    className="h-9 rounded-md border-slate-200 text-xs shadow-none focus-visible:border-[#1078A9] focus-visible:ring-[#1078A9]/20"
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="days" className="text-xs text-slate-600">
                                    Days Per Year <span className="text-red-500">*</span>
                                </Label>

                                <Input
                                    id="days"
                                    type="number"
                                    min={0}
                                    value={days}
                                    onChange={(e) => setDays(e.target.value)}
                                    placeholder="e.g. 21"
                                    className="h-9 rounded-md border-slate-200 text-xs shadow-none focus-visible:border-[#1078A9] focus-visible:ring-[#1078A9]/20"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Leave Policy */}
                    <section className="space-y-2.5">
                        <div>
                            <h3 className="text-xs font-semibold text-slate-800">
                                Leave Policy Settings
                            </h3>
                            <p className="text-[11px] text-slate-400">
                                Configure leave eligibility and conditions.
                            </p>
                        </div>

                        <div className="overflow-hidden rounded-lg border border-slate-200 divide-y divide-slate-100">

                            <div className="flex items-center justify-between px-3 py-2">
                                <div>
                                    <p className="text-xs font-medium text-slate-800">
                                        Paid Leave
                                    </p>
                                    <p className="text-[11px] text-slate-400">
                                        Employee receives regular pay
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
                                    className="scale-90 data-[state=checked]:bg-[#1078A9] data-[state=unchecked]:bg-slate-300"
                                />
                            </div>

                            <div className="flex items-center justify-between px-3 py-2">
                                <div>
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
                                    className="scale-90 data-[state=checked]:bg-[#1078A9] data-[state=unchecked]:bg-slate-300"
                                />
                            </div>

                            <div className="flex items-center justify-between px-3 py-2">
                                <div>
                                    <p className="text-xs font-medium text-slate-800">
                                        Allow Carry Over
                                    </p>
                                    <p className="text-[11px] text-slate-400">
                                        Unused days roll over
                                    </p>
                                </div>

                                <Switch
                                    checked={carriesOver}
                                    disabled={!isPaid}
                                    onCheckedChange={setCarriesOver}
                                    className="scale-90 data-[state=checked]:bg-[#1078A9] data-[state=unchecked]:bg-slate-300"
                                />
                            </div>

                            {carriesOver && (
                                <div className="flex items-center justify-between gap-3 bg-slate-50 px-3 py-2">
                                    <Label htmlFor="carryover" className="text-xs text-slate-700">
                                        Maximum Carry Over Days
                                    </Label>

                                    <Input
                                        id="carryover"
                                        type="number"
                                        min={0}
                                        value={maxCarryoverDays}
                                        onChange={(e) => setMaxCarryoverDays(e.target.value)}
                                        placeholder="5"
                                        className="h-8 w-20 rounded-md border-slate-200 bg-white text-xs shadow-none"
                                    />
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <DialogFooter className="flex-row justify-end gap-2 border-t border-slate-100 bg-slate-50/50 px-8 py-6">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isPending}
                        onClick={() => setOpen(false)}
                        className="h-8 rounded-md border-slate-200 bg-white px-3 text-xs text-slate-600 shadow-none hover:bg-slate-50"
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isPending || !name.trim() || !days}
                        className="h-8 rounded-md bg-[#1078A9] px-3 text-xs text-white hover:bg-[#0d668f]"
                    >
                        {isPending ? (
                            <ButtonLoader text="Creating..." />
                        ) : (
                            <>
                                <Plus size={13} className="mr-1" />
                                Create Leave Type
                            </>
                        )}
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
};

export default CreateLeaveTypeDialog;
