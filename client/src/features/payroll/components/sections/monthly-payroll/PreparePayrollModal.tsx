import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import PreparePayrollForm from "./PreparePayrollForm";



interface PreparePayrollModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const PreparePayrollModal = ({
    open,
    onOpenChange,
}: PreparePayrollModalProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-137.5 bg-white">
                <DialogHeader>
                    <DialogTitle>Prepare Monthly Payroll</DialogTitle>
                    <DialogDescription>
                        Select the payroll month and year to create a new payroll record.
                    </DialogDescription>
                </DialogHeader>

                <PreparePayrollForm
                    onSuccess={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
};

export default PreparePayrollModal;