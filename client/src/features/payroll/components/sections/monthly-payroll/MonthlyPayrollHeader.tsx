import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MonthlyPayrollHeaderProps {
    onPreparePayroll: () => void;
}

const MonthlyPayrollHeader = ({
    onPreparePayroll,
}: MonthlyPayrollHeaderProps) => {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
                <h2 className="text-xl font-semibold tracking-tight">
                    Monthly Payroll
                </h2>

                <p className="text-sm text-muted-foreground">
                    Prepare, calculate, review and approve employee payroll.
                </p>
            </div>

            <Button onClick={onPreparePayroll} 
             className="h-9 gap-2 rounded-lg px-3 text-sm text-white cursor-pointer">
                <Plus className="mr-2 h-4 w-4" />
                Prepare Payroll
            </Button>
        </div>
    );
};

export default MonthlyPayrollHeader;
