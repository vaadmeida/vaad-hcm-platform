import { Calculator, Check, ClipboardCheck, CreditCard, FilePlus2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PayrollStatus } from "@/features/payroll/types/payroll.types";


type PayrollActionButtonProps = {
    status: PayrollStatus;
    onCalculate: () => void;
    isCalculating: boolean;
    onReview?: () => void;
    isReviewing?: boolean;
    onApprove?: () => void;
    isApproving?: boolean;
    onProcess?: () => void;
    isProcessing?: boolean;
    onGeneratePayslips?: () => void;
    isGeneratingPayslips?: boolean;
    onViewPayslips?: () => void;
    payslipsReady?: boolean;
};

export function PayrollActionButton({
    status,
    onCalculate,
    onReview,
    onApprove,
    onProcess,
    isCalculating,
    isReviewing,
    isApproving,
    isProcessing,
    onGeneratePayslips,
    isGeneratingPayslips,
    onViewPayslips,
    payslipsReady
}: PayrollActionButtonProps) {
    const actions = {
        DRAFT: {
            label: "Calculate Payroll",
            pendingLabel: "Calculating...",
            onClick: onCalculate,
            isPending: isCalculating,
            Icon: Calculator,
        },
        CALCULATED: {
            label: "Review Payroll",
            pendingLabel: "Reviewing...",
            onClick: onReview,
            isPending: isReviewing,
            Icon: ClipboardCheck,
        },
        REVIEWED: {
            label: "Approve Payroll",
            pendingLabel: "Approving...",
            onClick: onApprove,
            isPending: isApproving,
            Icon: Check,
        },
        APPROVED: {
            label: "Process Payroll",
            pendingLabel: "Processing...",
            onClick: onProcess,
            isPending: isProcessing,
            Icon: CreditCard,
        },
        PROCESSED: payslipsReady
            ? {
                label: "View Payslips",
                pendingLabel: "View Payslips",
                onClick: onViewPayslips,
                isPending: false,
                Icon: FileText,
            }
            : {
                label: "Generate Payslips",
                pendingLabel: "Generating...",
                onClick: onGeneratePayslips,
                isPending: isGeneratingPayslips,
                Icon: FilePlus2,
            },
    };

    const action = actions[status];
    if (!action?.onClick) return null;

    const { Icon, label, pendingLabel, onClick, isPending } = action;

    return (
        <Button
            type="button"
            onClick={onClick}
            disabled={isPending}
            className="h-9 gap-2 rounded-lg px-3 text-sm text-white cursor-pointer"
        >
            <Icon className="h-4 w-4" />
            {isPending ? pendingLabel : label}
        </Button>
    );
}