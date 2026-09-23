import { CalendarDays, CheckCircle2 } from "lucide-react";

import type { EmployeeSalary } from "../types/salary.types.ts";

interface SalaryOverviewProps {
  salary: EmployeeSalary;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-NG", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

const SalaryOverview = ({ salary }: SalaryOverviewProps) => {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {/* Heading */}
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Salary Overview
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Current compensation details
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />

          <span className="text-xs font-medium text-emerald-700">
            Active
          </span>
        </div>
      </div>

      {/* Salary highlight */}
      <div className="px-6 py-7">
        <p className="text-sm font-medium text-gray-500">
          Annual Base Salary
        </p>

        <div className="mt-2 flex flex-wrap items-end gap-x-4 gap-y-1">
          <p className="text-3xl font-bold tracking-tight text-gray-950">
            {formatCurrency(salary.annualBaseSalary)}
          </p>

          <span className="mb-1 text-sm text-gray-400">
            per year
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="border-t border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-3">
          <div className="border-b border-gray-100 px-6 py-5 sm:border-b-0 sm:border-r">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Monthly Gross
            </p>

            <p className="mt-2 text-lg font-semibold text-gray-900">
              {formatCurrency(salary.monthlyGross)}
            </p>
          </div>

          <div className="border-b border-gray-100 px-6 py-5 sm:border-b-0 sm:border-r">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Net Pay
            </p>

            <p className="mt-2 text-lg font-semibold text-gray-900">
              {formatCurrency(salary.netPay)}
            </p>
          </div>

          <div className="px-6 py-5">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Effective Date
            </p>

            <div className="mt-2 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-gray-400" />

              <p className="text-lg font-semibold text-gray-900">
                {formatDate(salary.effectiveDate)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-6 py-3">
        <span className="text-xs text-gray-400">
          PAYE deduction
        </span>

        <span className="text-sm font-medium text-gray-700">
          {formatCurrency(salary.paye)}
        </span>
      </div>
    </section>
  );
};

export default SalaryOverview;