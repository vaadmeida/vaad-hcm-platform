import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ProcessPayrollDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isProcessing: boolean;
    canConfirm: boolean;
};

const hairline = "border-[rgba(156,163,175,0.20)]!";

export default function ProcessPayrollDialog({
    open,
    onOpenChange,
    onConfirm,
    isProcessing,
    canConfirm,
}: ProcessPayrollDialogProps) {
    return (
        <AlertDialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!isProcessing) onOpenChange(nextOpen);
            }}
        >
            <AlertDialogContent
                className={`gap-0 overflow-hidden rounded-2xl bg-white p-0 text-slate-950 shadow-xl sm:max-w-115 ${hairline}`}
            >
                <AlertDialogHeader className="px-6 py-5 text-left">
                    <AlertDialogTitle>Confirm payroll payment</AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-600">
                        Confirm that Finance has paid the employees in this payroll.
                        This records the payment confirmation and marks the payroll
                        as processed.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className={`border-t px-6 py-4 ${hairline}`}>
                    <AlertDialogCancel
                        disabled={isProcessing}
                        className={`bg-white text-slate-700 ${hairline}`}
                    >
                        Cancel
                    </AlertDialogCancel>

                    <Button
                        type="button"
                        onClick={onConfirm}
                        disabled={isProcessing || !canConfirm}
                        aria-busy={isProcessing}
                    >
                        {isProcessing ? "Processing…" : "Confirm payment"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}