import {
    AlertTriangle,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

interface TerminateEmployeeDialogProps {
    open: boolean;
    employeeName: string;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isPending?: boolean;
}

const TerminateEmployeeDialog = ({
    open,
    employeeName,
    onOpenChange,
    onConfirm,
    isPending
}: TerminateEmployeeDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-105 rounded-xl border border-gray-200 bg-white p-6">
                <DialogHeader className="items-center text-center">
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>

                    <DialogTitle className="text-lg font-semibold text-slate-900">
                        Terminate Employee?
                    </DialogTitle>

                    <DialogDescription className="text-sm leading-6 text-slate-500">
                        Are you sure you want to terminate{" "}
                        <span className="font-medium text-slate-700">
                            {employeeName}
                        </span>
                        ? Their status will be changed to terminated.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="mt-4 flex-row justify-center gap-3 sm:justify-center">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isPending}
                        className="min-w-25 border-primary text-secondary hover:bg-secondary/5"
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        onClick={onConfirm}
                        disabled={isPending}
                        className="min-w-25 bg-red-600 text-white hover:bg-red-700"
                    >
                        {isPending ? "Terminating..." : "Terminate"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default TerminateEmployeeDialog;