import ErrorState from "@/components/common/ErrorState";

import SalaryOverview from "@/features/salary/components/SalaryOverview";
import SalaryComponents from "@/features/salary/components/SalaryComponents";
import AdditionalEarnings from "@/features/salary/components/AdditionalEarnings";

import { useMySalary } from "@/features/salary/hooks/useMySalary";

const MySalaryStructure = () => {
  const { data, isLoading, isError } = useMySalary();

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Loading salary structure...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState message="Failed to load your salary structure." />
    );
  }

  const salary = data?.data;

  if (!salary) {
    return (
      <ErrorState
        title="No salary structure found"
        message="Your salary structure has not been set up yet."
      />
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

      <SalaryOverview salary={salary} />

      <SalaryComponents components={salary.components} />

      <AdditionalEarnings earnings={salary.additionalEarnings} />
    </div>
  );
};

export default MySalaryStructure;