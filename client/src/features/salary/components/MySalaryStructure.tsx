import { useState } from "react";
import { Wallet } from "lucide-react";

import ErrorState from "@/components/common/ErrorState";

import SalaryOverview from "@/features/salary/components/SalaryOverview";
import SalaryComponents from "@/features/salary/components/SalaryComponents";
import AdditionalEarnings from "@/features/salary/components/AdditionalEarnings";

import { useMySalary } from "@/features/salary/hooks/useMySalary";
import SalaryHistory from "./salary-histpry/SalaryHistory";
import SalaryHistoryDetailsModal from "./salary-histpry/SalaryHistoryDetailsModal";

import type { EmployeeSalaryHistory } from "@/features/salary/types/salary.types";

const MySalaryStructure = () => {
  const { data, isLoading, isError } = useMySalary();

  const [selectedHistorySalary, setSelectedHistorySalary] = useState<EmployeeSalaryHistory | null>(null);
  const [isHistoryDetailsOpen, setIsHistoryDetailsOpen] = useState(false);

  const handleViewHistoryDetails = (salary: EmployeeSalaryHistory) => {
    setSelectedHistorySalary(salary);
    setIsHistoryDetailsOpen(true);
  };

  const salary = data?.data;

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Loading salary information...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState message="Failed to load your salary information." />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Salary Structure
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          View your current compensation structure and earnings.
        </p>
      </div>

      {salary ? (
        <>
          <SalaryOverview salary={salary} />

          <SalaryComponents components={salary.components} />

          <AdditionalEarnings earnings={salary.additionalEarnings} />
        </>
      ) : (
        <div className="rounded-xl border border-dashed bg-white px-6 py-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1078A9]/10">
            <Wallet className="h-6 w-6 text-[#1078A9]" />
          </div>

          <h3 className="mt-4 text-base font-semibold text-gray-900">
            No Salary Structure Yet
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            Your salary structure has not been set up yet.
            Please contact your HR team for more information.
          </p>
        </div>
      )}

      {/* Salary History */}
      {salary?.employeeId && (
        <SalaryHistory
          employeeId={salary.employeeId}
          onViewDetails={handleViewHistoryDetails}
        />
      )}

      {/* Historical Salary Details Modal */}
      <SalaryHistoryDetailsModal
        open={isHistoryDetailsOpen}
        onOpenChange={setIsHistoryDetailsOpen}
        salary={selectedHistorySalary}
      />
    </div>
  );
};

export default MySalaryStructure;