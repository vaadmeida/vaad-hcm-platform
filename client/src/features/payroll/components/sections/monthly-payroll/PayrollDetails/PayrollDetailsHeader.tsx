import { ArrowLeft, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PayrollDetailsHeaderProps {
    onBack: () => void;
    onCalculate?: () => void;
    isCalculating?: boolean;
}

const PayrollDetailsHeader = ({
    onBack,
    onCalculate,
    isCalculating,
}: PayrollDetailsHeaderProps) => {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={onBack}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>

                <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                        Payroll Details
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        View payroll information and employee breakdown.
                    </p>
                </div>
            </div>

            <Button
                onClick={onCalculate}
                disabled={isCalculating}
                className="h-9 gap-2 rounded-lg px-3 text-sm text-white cursor-pointer"
            >
                <Calculator className="mr-2 h-4 w-4" />
                {isCalculating ? "Calculating..." : "Calculate Payroll"}
            </Button>
        </div>
    );
};

export default PayrollDetailsHeader;