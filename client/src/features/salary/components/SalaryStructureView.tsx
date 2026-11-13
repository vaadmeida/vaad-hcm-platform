import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/common/ErrorState";

import SalaryOverview from "@/features/salary/components/SalaryOverview";
import SalaryComponents from "@/features/salary/components/SalaryComponents";
import AdditionalEarnings from "@/features/salary/components/AdditionalEarnings";

import { useEmployeeSalary } from "@/features/salary/hooks/useEmployeeSalary";
import SalaryHistory from "./salary-histpry/SalaryHistory";
import { useState } from "react";
import type { EmployeeSalaryHistory } from "../types/salary.types";
import SalaryHistoryDetailsModal from "./salary-histpry/SalaryHistoryDetailsModal";

interface SalaryStructureViewProps {
    employeeId: string;
    onBack?: () => void;
}

const SalaryStructureView = ({
    employeeId,
    onBack,
}: SalaryStructureViewProps) => {
    const [selectedHistorySalary, setSelectedHistorySalary] =
        useState<EmployeeSalaryHistory | null>(null);

    const [isHistoryDetailsOpen, setIsHistoryDetailsOpen] =
        useState(false);
    const { data, isLoading, isError } = useEmployeeSalary(employeeId);

    if (isLoading) {
        return (
            <div className="rounded-xl border bg-white p-8 text-center">
                Loading salary structure...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="space-y-4">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="gap-2 text-[#1078A9] hover:bg-[#1078A9]/10 hover:text-[#1078A9] cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to employees
                </Button>

                <ErrorState message="Failed to load salary structure." />
            </div>
        );
    }

    const salary = data?.data;

    if (!salary) return null;

    return (
        <div className="space-y-6">
            <Button
                variant="ghost"
                onClick={onBack}
                className="gap-2 text-[#1078A9] hover:bg-[#1078A9]/10 hover:text-[#1078A9] cursor-pointer"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to employees
            </Button>

            <div>
                <h2 className="text-lg font-semibold text-gray-900">
                    Salary Structure
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                    View the employee's current compensation structure.
                </p>
            </div>

            <SalaryOverview salary={salary} />

            <SalaryComponents components={salary.components} />

            <AdditionalEarnings earnings={salary.additionalEarnings} />

            <SalaryHistory
                employeeId={employeeId}
                onViewDetails={(salary) => {
                    setSelectedHistorySalary(salary);
                    setIsHistoryDetailsOpen(true);
                }}
            />

            <SalaryHistoryDetailsModal
                open={isHistoryDetailsOpen}
                onOpenChange={setIsHistoryDetailsOpen}
                salary={selectedHistorySalary}
            />
        </div>
    );
};

export default SalaryStructureView;