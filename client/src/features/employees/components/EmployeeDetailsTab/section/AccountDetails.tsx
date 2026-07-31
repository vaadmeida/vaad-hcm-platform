import type { Employee } from "@/features/employees/types/employee.types";
import { Building2, CreditCard } from "lucide-react";

import InfoItem from "./InfoItem";

interface AccountDetailsProps {
  employee: Employee;
}

const AccountDetails = ({
  employee,
}: AccountDetailsProps) => {
  const { payroll } = employee;

  return (
    <section className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex items-center gap-2">
        <CreditCard className="h-4 w-4 shrink-0 text-[#1078A9]" />

        <h2 className="text-sm font-semibold text-[#121417]">
          Account Details
        </h2>
      </div>

      {/* Information */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        <InfoItem
          label="Bank Name"
          value={payroll.bank_name}
          icon={<Building2 className="h-3.5 w-3.5" />}
        />

        <InfoItem
          label="Account Name"
          value={payroll.account_name}
        />

        <InfoItem
          label="Account Number"
          value={payroll.account_number}
        />

        <InfoItem
          label="PAYE ID"
          value={payroll.paye_id}
        />
      </div>
    </section>
  );
};

export default AccountDetails;