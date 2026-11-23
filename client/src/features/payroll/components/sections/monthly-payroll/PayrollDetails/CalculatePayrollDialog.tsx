import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type CalculatePayrollDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isCalculating: boolean;
    errorMessage?: string | undefined;
};

export default function CalculatePayrollDialog({
    open,
    onOpenChange,
    onConfirm,
    isCalculating,
    errorMessage,
}: CalculatePayrollDialogProps) {
    return (
        <AlertDialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!isCalculating) onOpenChange(nextOpen);
            }}
        >
            <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                    <AlertDialogTitle>Calculate payroll?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This calculates employee pay, deductions, and totals
                        for the selected payroll period.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {errorMessage && (
                    <p role="alert" className="text-sm text-red-600">
                        {errorMessage}
                    </p>
                )}

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isCalculating}>
                        Cancel
                    </AlertDialogCancel>

                    <Button
                        type="button"
                        onClick={onConfirm}
                        disabled={isCalculating}
                        className="text-white cursor-pointer"
                    >
                        {isCalculating ? "Calculating..." : "Calculate Payroll"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}