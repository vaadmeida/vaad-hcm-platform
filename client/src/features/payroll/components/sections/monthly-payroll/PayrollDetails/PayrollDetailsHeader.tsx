import type { ComponentProps } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PayrollActionButton } from "./PayrollActionButton";

type PayrollDetailsHeaderProps = ComponentProps<typeof PayrollActionButton> & {
    onBack: () => void;
};

const PayrollDetailsHeader = ({
    onBack,
    ...actionProps
}: PayrollDetailsHeaderProps) => {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={onBack}
                    aria-label="Back to payrolls"
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

            <PayrollActionButton {...actionProps} />
        </div>
    );
};

export default PayrollDetailsHeader;