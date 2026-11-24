import { LoaderCircle, ShieldCheck } from "lucide-react";
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

type ApprovePayrollDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isApproving: boolean;
    canConfirm: boolean;
};

const hairline = "border-[rgba(156,163,175,0.20)]!";

export default function ApprovePayrollDialog({
    open,
    onOpenChange,
    onConfirm,
    isApproving,
    canConfirm,
}: ApprovePayrollDialogProps) {
    return (
        <AlertDialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!isApproving) onOpenChange(nextOpen);
            }}
        >
            <AlertDialogContent
                className={`gap-0 overflow-hidden rounded-2xl bg-white p-0 text-slate-950 shadow-xl sm:max-w-115 ${hairline}`}
            >
                <AlertDialogHeader className="gap-0 px-6 pb-5 pt-6 text-left">
                    <div className={`mb-4 grid size-11 place-items-center rounded-xl border bg-slate-50 text-primary ${hairline}`}>
                        <ShieldCheck aria-hidden="true" className="size-5" />
                    </div>

                    <AlertDialogTitle className="text-xl font-semibold tracking-tight">
                        Approve payroll?
                    </AlertDialogTitle>

                    <AlertDialogDescription className="mt-2 text-sm leading-6 text-slate-600">
                        Confirm management approval for this reviewed payroll.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="px-6 pb-6">
                    <div className={`rounded-xl border bg-slate-50/70 px-4 py-3 ${hairline}`}>
                        <p className="text-sm font-medium text-slate-900">
                            Next step · Finance processing
                        </p>
                        <p className="mt-1 text-sm leading-5 text-slate-600">
                            Finance can confirm payment once the payroll is approved.
                        </p>
                    </div>
                </div>

                <AlertDialogFooter
                    className={`gap-2 border-t px-6 py-4 sm:justify-end ${hairline}`}
                >
                    <AlertDialogCancel
                        disabled={isApproving}
                        className={`mt-0 h-10 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 ${hairline}`}
                    >
                        Cancel
                    </AlertDialogCancel>

                    <Button
                        type="button"
                        onClick={onConfirm}
                        disabled={isApproving || !canConfirm}
                        aria-busy={isApproving}
                        className="h-10 gap-2 px-4"
                    >
                        {isApproving && (
                            <LoaderCircle
                                aria-hidden="true"
                                className="size-4 motion-safe:animate-spin"
                            />
                        )}
                        {isApproving ? "Approving…" : "Approve payroll"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
