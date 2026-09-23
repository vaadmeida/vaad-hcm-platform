
import { Pencil, Plus } from "lucide-react";

import ErrorState from "@/components/common/ErrorState";
import { Button } from "@/components/ui/button";

import SalaryOverview from "@/features/salary/components/SalaryOverview";
import SalaryComponents from "@/features/salary/components/SalaryComponents";
import AdditionalEarnings from "@/features/salary/components/AdditionalEarnings";
import { useEmployeeSalary } from "@/features/salary/hooks/useEmployeeSalary";

interface EmployeeSalaryStructureProps {
  employee: {
    id: string;
  };
}

const EmployeeSalaryStructure = ({
  employee,
}: EmployeeSalaryStructureProps) => {
  // const [isAddSalaryOpen, setIsAddSalaryOpen] = useState(false);
  //const [isEditSalaryOpen, setIsEditSalaryOpen] = useState(false);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useEmployeeSalary(employee.id);

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Loading salary structure...
        </p>
      </div>
    );
  }

  const isNotFound =
    isError &&
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "status" in error.response &&
    error.response.status === 404;

  if (isNotFound) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
        <h3 className="text-sm font-semibold text-gray-900">
          No salary structure found
        </h3>

        <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
          This employee does not have an active salary structure yet.
        </p>

        <Button
          type="button"
          className="mt-4 h-9 gap-2 rounded-lg px-3 text-sm text-white cursor-pointer"
        // onClick={() => setIsAddSalaryOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add Salary
        </Button>
      </div>
    );
  }

  if (isError) {
    return <ErrorState message="Failed to load salary structure." />;
  }

  const salary = data?.data;

  if (!salary) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
        <h3 className="text-sm font-semibold text-gray-900">
          No salary structure found
        </h3>

        <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
          This employee does not have an active salary structure yet.
        </p>

        <Button
          type="button"
          className="mt-4 h-9 gap-2 rounded-lg px-3 text-sm text-white cursor-pointer"
        //   onClick={() => setIsAddSalaryOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add Salary
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Salary Structure
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage the employee&apos;s current compensation structure.
          </p>
        </div>

        <Button
          type="button"
          className="h-9 gap-2 rounded-lg px-3 text-sm text-white cursor-pointer"
        //     onClick={() => setIsEditSalaryOpen(true)}
        >
          <Pencil className="h-4 w-4" />
          Edit Salary
        </Button>
      </div>

      <SalaryOverview salary={salary} />

      <SalaryComponents components={salary.components} />

      <AdditionalEarnings earnings={salary.additionalEarnings} />
    </div>
  );
};

export default EmployeeSalaryStructure;