import ErrorState from "@/components/common/ErrorState";

import SalaryOverview from "@/features/salary/components/SalaryOverview";
import SalaryComponents from "@/features/salary/components/SalaryComponents";
import AdditionalEarnings from "@/features/salary/components/AdditionalEarnings";

import { useEmployeeSalary } from "@/features/salary/hooks/useEmployeeSalary";

import { useState } from "react";
import SalaryHistoryDetailsModal from "@/features/salary/components/salary-histpry/SalaryHistoryDetailsModal";
import SalaryHistory from "@/features/salary/components/salary-histpry/SalaryHistory";
import type { EmployeeSalaryHistory } from "@/features/salary/types/salary.types";
import { Wallet } from "lucide-react";


interface EmployeeSalaryStructureProps {
    employeeId: string;
}

const EmployeeSalaryStructure = ({
    employeeId,
}: EmployeeSalaryStructureProps) => {
    const [selectedHistorySalary, setSelectedHistorySalary] =
        useState<EmployeeSalaryHistory | null>(null);

    const [isHistoryDetailsOpen, setIsHistoryDetailsOpen] =
        useState(false);

    const { data, isLoading, isError } = useEmployeeSalary(employeeId);

    if (isLoading) {
        return (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
                <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-[#1078A9]" />
                <p className="mt-3 text-sm text-gray-500">
                    Loading salary information...
                </p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="space-y-4">
                <ErrorState message="Failed to load salary information." />
            </div>
        );
    }

    const salary = data?.data;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold text-gray-900">
                    Salary Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    View the employee's current compensation and previous salary records.
                </p>
            </div>

            {/* Current salary */}
            {salary ? (
                <div className="space-y-6">
                    <SalaryOverview salary={salary} />

                    <SalaryComponents components={salary.components} />

                    <AdditionalEarnings earnings={salary.additionalEarnings} />
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#1078A9]/10">
                        <Wallet className="h-6 w-6 text-[#1078A9]" />
                    </div>

                    <h3 className="mt-4 text-base font-semibold text-gray-900">
                        No Salary Structure Configured
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                        There is currently no active salary structure for this employee.
                        Salary information will appear here once one has been configured.
                    </p>
                </div>
            )}

            {/* Salary history always remains visible */}
            <SalaryHistory
                employeeId={employeeId}
                onViewDetails={(historySalary) => {
                    setSelectedHistorySalary(historySalary);
                    setIsHistoryDetailsOpen(true);
                }}
            />

            {/* Historical salary details */}
            <SalaryHistoryDetailsModal
                open={isHistoryDetailsOpen}
                onOpenChange={setIsHistoryDetailsOpen}
                salary={selectedHistorySalary}
            />
        </div>
    );
};

export default EmployeeSalaryStructure;
