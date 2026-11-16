
import { useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import ButtonLoader from "@/components/common/ButtonLoader";
import type { LeaveType } from "@/features/leaves/types/leave.types";
import { useDeleteLeaveType } from "@/features/leaves/hooks/useDeleteLeaveTypes";

interface DeleteLeaveTypeDialogProps {
    leaveType: LeaveType;
}

const DeleteLeaveTypeDialog = ({
    leaveType,
}: DeleteLeaveTypeDialogProps) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const {
        mutateAsync: deleteLeaveType,
        isPending: isDeleting,
    } = useDeleteLeaveType();

    const handleDelete = async () => {
        try {
            await deleteLeaveType({
                id: leaveType.id,
            });

            toast.success("Leave type deleted successfully.");
            setDeleteDialogOpen(false);

        } catch (error) {
            if (axios.isAxiosError(error)) {
                const response = error.response?.data;

                if (response?.code === "LEAVE_TYPE_IN_USE") {
                    toast.error(
                        response.message ||
                        "This leave type cannot be deleted because it is being used by leave requests."
                    );
                    return;
                }

                toast.error(
                    response?.message || "Failed to delete leave type."
                );
                return;
            }

            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <AlertDialog
            open={deleteDialogOpen}
            onOpenChange={(open) => {
                if (!isDeleting) setDeleteDialogOpen(open);
            }}
        >
            <AlertDialogTrigger asChild>
                <button
                    type="button"
                    title="Delete leave type"
                    aria-label="Delete leave type"
                    className="inline-flex items-center text-red-600 hover:text-red-700 cursor-pointer"
                >
                    <Trash2 size={15} />
                </button>
            </AlertDialogTrigger>

            <AlertDialogContent className="max-w-100 gap-0 rounded-xl border border-slate-200 bg-white p-6 shadow-xl">

                <AlertDialogHeader className="space-y-2 text-left">
                    <AlertDialogTitle className="text-base font-semibold text-slate-900">
                        Delete leave type
                    </AlertDialogTitle>

                    <AlertDialogDescription className="text-sm leading-6 text-slate-500">
                        Are you sure you want to delete{" "}
                        <span className="font-medium text-slate-900">
                            "{leaveType.name}"
                        </span>
                        ? This action is permanent. Associated leave balances
                        will also be deleted if the leave type is eligible for
                        deletion.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="mt-6 flex-row justify-end gap-2 border-0 bg-white p-0 shadow-none">

                    <AlertDialogCancel
                        disabled={isDeleting}
                        className="mt-0 h-9 rounded-md border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 shadow-none hover:bg-slate-50 cursor-pointer"
                    >
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        disabled={isDeleting}
                        onClick={(event) => {
                            event.preventDefault();
                            void handleDelete();
                        }}
                        className="h-9 rounded-md border-0 bg-red-600 px-4 text-sm font-medium text-white shadow-none hover:bg-red-700 focus-visible:ring-red-500 cursor-pointer"
                    >
                        {isDeleting ? (
                            <ButtonLoader text="Deleting..." />
                        ) : (
                            "Delete"
                        )}
                    </AlertDialogAction>

                </AlertDialogFooter>

            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteLeaveTypeDialog;
