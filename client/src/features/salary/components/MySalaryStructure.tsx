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
    return <ErrorState message="Failed to load your salary structure." />;
  }

  const salary = data?.data;

  if (!salary) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
        <h3 className="text-sm font-semibold text-gray-900">
          No salary structure found
        </h3>

        <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
          Your salary structure has not been set up yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
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