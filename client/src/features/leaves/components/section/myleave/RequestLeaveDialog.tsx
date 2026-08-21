import { useState } from "react";
import { CalendarPlus, Upload, X } from "lucide-react";

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
import { useGetLeaveTypes } from "@/features/leaves/hooks/useGetLeaveType";
import ButtonLoader from "@/components/common/ButtonLoader";
import { getShortFileName } from "@/utils/getShortFileName";
import { useSubmitLeaveRequest } from "@/features/leaves/hooks/useSubmitLeaveRequest";
import type { LeaveApiError } from "@/features/leaves/types/leave.types";
import axios from "axios";
import { toast } from "sonner";

const RequestLeaveDialog = () => {
    const [open, setOpen] = useState(false);

    const [leaveTypeId, setLeaveTypeId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reason, setReason] = useState("");
    const [document, setDocument] = useState<File | null>(null);


    const { data } = useGetLeaveTypes();

    const leaveTypes = data?.data ?? [];

    const selectedLeaveType = leaveTypes?.find((leave) => leave.id === leaveTypeId);

    const requiresDocument = selectedLeaveType?.requires_document ?? false;

    const { mutate: submitLeaveRequest, isPending } = useSubmitLeaveRequest();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        const file = event.target.files?.[0];

        if (file) {
            setDocument(file);
        }
    };

    const removeDocument = () => { setDocument(null) };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!leaveTypeId) {
            toast.error("Please select a leave type");
            return;
        }

        if (!startDate || !endDate) {
            toast.error("Please select the leave dates");
            return;
        }

        const payload = {
            leave_type_id: leaveTypeId,
            start_date: startDate,
            end_date: endDate,
            reason: reason.trim() || undefined
        };

        submitLeaveRequest(payload, {
            onSuccess: () => {
                toast.success("Leave request submitted successfully");

                setOpen(false);

                setLeaveTypeId("");
                setStartDate("");
                setEndDate("");
                setReason("");
                setDocument(null);
            },

            onError: (error) => {
                if (axios.isAxiosError<LeaveApiError>(error)) {
                    toast.error(
                        error.response?.data?.message ||
                        "Failed to submit leave request"
                    );

                    return;
                }

                toast.error("Failed to submit leave request");
            },
        });
    };

    const handleOpenChange = (value: boolean) => {
        setOpen(value);

        if (!value) {
            setLeaveTypeId("");
            setStartDate("");
            setEndDate("");
            setReason("");
            setDocument(null);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="h-9 gap-2 bg-[#1078A9] px-4 text-sm font-medium text-white hover:bg-[#0d668f]">
                    <CalendarPlus className="h-4 w-4" />
                    Request Leave
                </Button>
            </DialogTrigger>

            <DialogContent className="bg-white sm:max-w-125">
                <DialogHeader className="border-b border-gray-100 pb-3">
                    <DialogTitle className="text-base font-semibold text-gray-900">
                        Request Leave
                    </DialogTitle>

                    <DialogDescription className="text-xs text-gray-500">
                        Submit a leave request for approval.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-2">

                        {/* Leave Type */}
                        <div className="space-y-1.5">
                            <Label htmlFor="leave-type">
                                Leave Type
                                <span className="ml-1 text-red-500">*</span>
                            </Label>

                            <select
                                id="leave-type"
                                value={leaveTypeId}
                                onChange={(event) =>
                                    setLeaveTypeId(event.target.value)
                                }
                                required
                                className="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#1078A9] focus:ring-1 focus:ring-[#1078A9]/20"
                            >
                                <option value="">
                                    Select leave type
                                </option>

                                {leaveTypes.map((leave) => (
                                    <option key={leave.id} value={leave.id}>
                                        {leave.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="start-date">
                                    Start Date
                                    <span className="ml-1 text-red-500">*</span>
                                </Label>

                                <Input
                                    id="start-date"
                                    type="date"
                                    value={startDate}
                                    onChange={(event) =>
                                        setStartDate(event.target.value)
                                    }
                                    required
                                    className="h-9 text-sm"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="end-date">
                                    End Date
                                    <span className="ml-1 text-red-500">*</span>
                                </Label>

                                <Input
                                    id="end-date"
                                    type="date"
                                    value={endDate}
                                    onChange={(event) =>
                                        setEndDate(event.target.value)
                                    }
                                    required
                                    className="h-9 text-sm"
                                />
                            </div>
                        </div>

                        {/* Reason */}
                        <div className="space-y-1.5">
                            <Label htmlFor="reason">
                                Reason
                            </Label>

                            <textarea
                                id="reason"
                                value={reason}
                                onChange={(event) =>
                                    setReason(event.target.value)
                                }
                                placeholder="Briefly explain the reason for your leave..."
                                rows={3}
                                className="w-full resize-none rounded-md border border-gray-200 px-3 py-2 text-sm outline-none placeholder:text-gray-400 focus:border-[#1078A9] focus:ring-1 focus:ring-[#1078A9]/20"
                            />
                        </div>

                        {/* Supporting Document */}
                        {requiresDocument && (
                            <div className="space-y-1.5">
                                <Label>
                                    Supporting Document
                                    <span className="ml-1 text-red-500">*</span>
                                </Label>

                                {!document ? (
                                    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-gray-300 px-4 py-3 transition hover:border-[#1078A9] hover:bg-gray-50">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#1078A9]/10">
                                            <Upload className="h-4 w-4 text-[#1078A9]" />
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-gray-800">
                                                Upload supporting document
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                PDF, JPG or PNG
                                            </p>
                                        </div>

                                        <input
                                            type="file"
                                            className="hidden"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={handleFileChange}
                                            required
                                        />
                                    </label>
                                ) : (
                                    <div className="flex min-w-0 items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                                        <div className="flex min-w-0 flex-1 items-center gap-2">
                                            <Upload className="h-4 w-4 shrink-0 text-[#1078A9]" />

                                            <span
                                                className="min-w-0 flex-1 truncate text-sm text-gray-700"
                                                title={document.name}
                                            >
                                                {getShortFileName(document.name)}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={removeDocument}
                                            className="shrink-0 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}

                                <p className="text-xs text-gray-500">
                                    This leave type requires supporting documentation.
                                </p>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="mt-3 border-t border-gray-100 pt-3">
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
                            className="h-8 bg-[#1078A9] px-4 text-sm text-white hover:bg-[#0d668f]"
                        >
                            {isPending ? (
                                <ButtonLoader text="Submitting Request..." />
                            ) : (
                                "Submit Request"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default RequestLeaveDialog;