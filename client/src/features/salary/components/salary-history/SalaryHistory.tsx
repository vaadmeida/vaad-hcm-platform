import {
  CalendarDays,
  Clock3,
  History,
  Wallet,
  ArrowUpRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useEmployeeSalaryHistory } from "../../hooks/useEmployeeSalaryHistory";
import type { EmployeeSalaryHistory } from "../../types/salary.types";

interface SalaryHistoryProps {
  employeeId: string;
  onViewDetails: (salary: EmployeeSalaryHistory) => void;
}

const BRAND_COLOR = "#1078A9";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const SalaryHistory = ({
  employeeId,
  onViewDetails,
}: SalaryHistoryProps) => {
  const {
    data: salaryHistory,
    isLoading,
    isError,
    refetch,
  } = useEmployeeSalaryHistory(employeeId);

  return (
    <Card className="gap-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <CardHeader className="border-b border-slate-100 px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                backgroundColor: `${BRAND_COLOR}12`,
                color: BRAND_COLOR,
              }}
            >
              <History className="h-5 w-5" />
            </div>

            <div>
              <CardTitle className="text-base font-semibold text-slate-900">
                Salary History
              </CardTitle>
              <p className="mt-1 text-sm text-slate-500">
                A record of previous employee compensation.
              </p>
            </div>
          </div>

          <Badge
            variant="outline"
            className="w-fit rounded-full border-[#1078A9]/20 bg-[#1078A9]/5 px-3 py-1 text-[#1078A9]"
          >
            {salaryHistory?.length ?? 0}{" "}
            {salaryHistory?.length === 1 ? "Record" : "Records"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="h-36 animate-pulse rounded-xl bg-slate-100"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm font-medium text-slate-800">
              Unable to load salary history
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Please try again.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 border-[#1078A9]/30 text-[#1078A9] hover:bg-[#1078A9]/5"
              onClick={() => refetch()}
            >
              Try Again
            </Button>
          </div>
        ) : !salaryHistory || salaryHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div
              className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{
                backgroundColor: `${BRAND_COLOR}10`,
                color: BRAND_COLOR,
              }}
            >
              <Wallet className="h-6 w-6" />
            </div>

            <h3 className="text-sm font-semibold text-slate-800">
              No Salary History Yet
            </h3>

            <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
              Previous salary structures will appear here when
              an employee's compensation is reviewed or updated.
            </p>
          </div>
        ) : (
          <div className="relative space-y-4">
            {salaryHistory.map((salary, index) => (
              <div key={salary.id} className="relative flex gap-4">
                {/* Timeline indicator */}
                <div className="flex flex-col items-center">
                  <div
                    className="z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-4 border-white"
                    style={{
                      backgroundColor: `${BRAND_COLOR}15`,
                      color: BRAND_COLOR,
                    }}
                  >
                    <History className="h-4 w-4" />
                  </div>

                  {index !== salaryHistory.length - 1 && (
                    <div className="absolute bottom-0 top-9 w-px bg-slate-200" />
                  )}
                </div>

                {/* Salary record */}
                <div className="mb-1 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-[#1078A9]/30 hover:shadow-sm">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-xl font-bold tracking-tight text-slate-900">
                            {formatCurrency(salary.annualBaseSalary)}
                          </h3>

                          <Badge
                            variant="secondary"
                            className="rounded-md bg-slate-100 text-xs font-medium text-slate-600"
                          >
                            Ended
                          </Badge>
                        </div>

                        <p className="mt-1 text-xs text-slate-500">
                          Annual Base Salary
                        </p>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 w-fit gap-2 border-[#1078A9]/25 text-[#1078A9] hover:bg-[#1078A9]/5 hover:text-[#1078A9]"
                        onClick={() => onViewDetails(salary)}
                      >
                        View Details
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-3 sm:grid-cols-3">
                      <div>
                        <p className="text-xs text-slate-500">
                          Monthly Gross
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {formatCurrency(salary.monthlyGross)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          Net Pay
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {formatCurrency(salary.netPay)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          PAYE
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {formatCurrency(salary.paye)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:gap-6">
                      <span className="flex items-center gap-2 text-xs text-slate-500">
                        <CalendarDays
                          className="h-3.5 w-3.5"
                          style={{ color: BRAND_COLOR }}
                        />
                        Effective: {formatDate(salary.effectiveDate)}
                      </span>

                      <span className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock3
                          className="h-3.5 w-3.5"
                          style={{ color: BRAND_COLOR }}
                        />
                        Ended:{" "}
                        {salary.endDate
                          ? formatDate(salary.endDate)
                          : "—"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !isError && salaryHistory && salaryHistory.length > 0 && (
          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
            <p className="text-xs text-slate-500">
              {salaryHistory.length} previous salary{" "}
              {salaryHistory.length === 1 ? "record" : "records"} found
            </p>

            <span
              className="text-xs font-medium"
              style={{ color: BRAND_COLOR }}
            >
              Compensation Records
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SalaryHistory;