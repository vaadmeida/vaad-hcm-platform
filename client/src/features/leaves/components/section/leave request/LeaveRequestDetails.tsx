import { Check, Clock, FileText, Send, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetLeaveRequestById } from "@/features/leaves/hooks/useGetLeaveRequestById";
import { useApproveOrRejectLeaveRequest } from "@/features/leaves/hooks/useApproveOrRejectLeaveRequest";
import ButtonLoader from "@/components/common/ButtonLoader";
import { useState } from "react";
import RejectLeaveDialog from "./RejectLeaveDialog";


interface LeaveRequestDetailsProps {
    requestId: string | null;
    open: boolean;
    onClose: () => void;
}

const LeaveRequestDetails = ({ requestId, open, onClose }: LeaveRequestDetailsProps) => {
    const { data, isLoading, isError } = useGetLeaveRequestById(requestId ?? "");
    const request = data?.data;

    const employeeName = request?.employee
        ? `${request.employee.first_name} ${request.employee.last_name}`
        : "Unknown Employee";

    const initials = employeeName
        .split(" ")
        .map((name) => name.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const formatDate = (date?: string | null) => {
        if (!date) return "—";

        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };


    const getStatusStyles = (status?: string) => {
        switch (status) {
            case "approved":
                return "bg-green-50 text-green-700";
            case "rejected":
                return "bg-red-50 text-red-700";
            case "pending":
                return "bg-amber-50 text-amber-700";
            default:
                return "bg-gray-50 text-gray-600";
        }
    };

    const approverName = request?.approver
        ? `${request.approver.first_name} ${request.approver.last_name}`
        : "HR / Manager";

    const { mutate: approveOrReject, isPending } = useApproveOrRejectLeaveRequest();

    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");


    const handleApprove = () => {
        if (!requestId) return;

        approveOrReject(
            {
                id: requestId,
                payload: {
                    action: "APPROVE",
                },
            },
            {
                onSuccess: () => {
                    onClose();
                },
            }
        );
    };

    const handleReject = () => {
        if (!requestId || !rejectionReason.trim()) return;

        approveOrReject(
            {
                id: requestId,
                payload: {
                    action: "REJECT",
                    rejectionReason: rejectionReason.trim(),
                },
            },
            {
                onSuccess: () => {
                    setRejectDialogOpen(false);
                    setRejectionReason("");
                    onClose();
                },
            }
        );
    };

    return (

        <>
            <Sheet open={open} onOpenChange={(value) => !value && onClose()}>
                <SheetContent className="flex h-full w-full flex-col border-l border-gray-200 bg-white p-0 sm:max-w-md">

                    {/* Header */}
                    <SheetHeader className="shrink-0 border-b border-border px-6 py-4">
                        <SheetTitle className="text-base font-semibold">
                            Leave Request Details
                        </SheetTitle>
                    </SheetHeader>

                    {/* Body */}
                    <div className="min-h-0 flex-1 overflow-y-auto px-6">

                        {isLoading && (
                            <div className="flex items-center justify-center py-16">
                                <p className="text-sm text-muted-foreground">
                                    Loading leave request...
                                </p>
                            </div>
                        )}

                        {isError && (
                            <div className="flex items-center justify-center py-16">
                                <p className="text-sm text-red-600">
                                    Failed to load leave request.
                                </p>
                            </div>
                        )}

                        {request && !isLoading && !isError && (
                            <div className="space-y-7 py-6">

                                {/* Employee */}
                                <section>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-12 w-12 shrink-0">
                                            {request.employee.avatar_url && (
                                                <AvatarImage src={request.employee.avatar_url} alt={employeeName} />
                                            )}

                                            <AvatarFallback className="bg-[#1078A9]/10 font-medium text-[#1078A9]">
                                                {initials}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold text-gray-900">
                                                {employeeName}
                                            </p>

                                            <p className="truncate text-xs text-muted-foreground">
                                                {request.employee.department?.name ?? "No Department"}
                                            </p>
                                        </div>

                                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getStatusStyles(request.status)}`}>
                                            {request.status}
                                        </span>
                                    </div>
                                </section>

                                {/* Leave Information */}
                                <section>
                                    <h3 className="mb-4 text-sm font-semibold text-gray-900">
                                        Leave Information
                                    </h3>

                                    <div className="grid grid-cols-2 gap-x-5 gap-y-5">
                                        <div>
                                            <p className="text-xs text-muted-foreground">Leave Type</p>
                                            <p className="mt-1 text-sm font-medium text-gray-900">
                                                {request.leaveType.name}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-muted-foreground">Applied On</p>
                                            <p className="mt-1 text-sm font-medium text-gray-900">
                                                {formatDate(request.created_at)}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-muted-foreground">Start Date</p>
                                            <p className="mt-1 text-sm font-medium text-gray-900">
                                                {formatDate(request.start_date)}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-muted-foreground">End Date</p>
                                            <p className="mt-1 text-sm font-medium text-gray-900">
                                                {formatDate(request.end_date)}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-muted-foreground">Duration</p>
                                            <p className="mt-1 text-sm font-medium text-gray-900">
                                                {request.total_days} working days
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Approver
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-gray-900">
                                                {request.approver
                                                    ? `${request.approver.first_name} ${request.approver.last_name}`
                                                    : "Pending"}
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* Reason */}
                                <section>
                                    <h3 className="mb-2 text-sm font-semibold text-gray-900">
                                        Reason
                                    </h3>

                                    <div className="rounded-lg bg-gray-50 px-4 py-3">
                                        <p className="text-sm leading-6 text-muted-foreground">
                                            {request.reason || "No reason provided"}
                                        </p>
                                    </div>
                                </section>

                                {/* Attachments */}
                                <section>
                                    <h3 className="mb-2 text-sm font-semibold text-gray-900">
                                        Attachments
                                    </h3>

                                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border px-4 py-6">
                                        <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-gray-50">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                        </div>

                                        <p className="text-sm text-muted-foreground">
                                            No files attached
                                        </p>
                                    </div>
                                </section>

                                {/* Approval History */}
                                <section className="pb-3">
                                    <h3 className="mb-4 text-sm font-semibold text-gray-900">
                                        Approval History
                                    </h3>

                                    <div className="space-y-5">

                                        {/* Submitted */}
                                        <div className="flex gap-3">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1078A9]/10 text-[#1078A9]">
                                                <Send className="h-4 w-4" />
                                            </div>

                                            <div className="pt-0.5">
                                                <p className="text-sm font-medium text-gray-900">
                                                    Leave request submitted
                                                </p>

                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    Submitted by {employeeName}
                                                </p>

                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {formatDate(request.created_at)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Pending */}
                                        {request.status === "pending" && (
                                            <div className="flex gap-3">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                                                    <Clock className="h-4 w-4" />
                                                </div>

                                                <div className="pt-0.5">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        Awaiting approval
                                                    </p>

                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        Waiting for HR or manager approval
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Approved */}
                                        {request.status === "approved" && (
                                            <div className="flex gap-3">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
                                                    <Check className="h-4 w-4" />
                                                </div>

                                                <div className="pt-0.5">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        Leave request approved
                                                    </p>

                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        Approved by {approverName}
                                                    </p>

                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {formatDate(request.approved_at)}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Rejected */}
                                        {request.status === "rejected" && (
                                            <div className="flex gap-3">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                                                    <X className="h-4 w-4" />
                                                </div>

                                                <div className="min-w-0 flex-1 pt-0.5">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        Leave request rejected
                                                    </p>

                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        Rejected by {approverName}
                                                    </p>

                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {formatDate(request.approved_at)}
                                                    </p>

                                                    {request.rejection_reason && (
                                                        <div className="mt-3 rounded-lg bg-red-50 px-3 py-2.5">
                                                            <p className="text-xs font-medium text-red-700">
                                                                Rejection reason
                                                            </p>

                                                            <p className="mt-1 text-xs leading-5 text-red-600">
                                                                {request.rejection_reason}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {request?.status === "pending" && (
                        <div className="shrink-0 border-t border-border bg-white px-6 py-4">
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRejectDialogOpen(true)}
                                    disabled={isPending}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-md border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                >
                                    <X className="h-4 w-4" />
                                    Reject
                                </button>

                                <button
                                    type="button"
                                    onClick={handleApprove}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[#1078A9] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0d668f] cursor-pointer"
                                >
                                    <Check className="h-4 w-4" />
                                    {isPending ? (
                                        <ButtonLoader text="Approving..." />
                                    ) : (
                                        "Approve"
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
            <RejectLeaveDialog
                open={rejectDialogOpen}
                rejectionReason={rejectionReason}
                isPending={isPending}
                onReasonChange={setRejectionReason}
                onClose={() => {
                    setRejectDialogOpen(false);
                    setRejectionReason("");
                }}
                onReject={handleReject}
            />
        </>

    );

};

export default LeaveRequestDetails;