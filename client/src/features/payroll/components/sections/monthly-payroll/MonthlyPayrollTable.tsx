
import type { MonthlyPayroll } from "@/features/payroll/types/payroll.types";
import MonthlyPayrollTableRow from "./MonthlyPayrollTableRow";

interface MonthlyPayrollTableProps {
    payrolls: MonthlyPayroll[];
    onPayrollClick: (payrollId: string) => void;
}

const MonthlyPayrollTable = ({
    payrolls,
    onPayrollClick,
}: MonthlyPayrollTableProps) => {
    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr className="border-y border-border bg-muted/10 text-left text-xs font-medium text-muted-foreground">
                        <th className="px-4 py-3">
                            Payroll Period
                        </th>

                        <th className="hidden px-4 py-3 xl:table-cell">
                            Employees
                        </th>

                        <th className="px-4 py-3">
                            Gross Payroll
                        </th>

                        <th className="hidden px-4 py-3 lg:table-cell">
                            PAYE
                        </th>

                        <th className="px-4 py-3">
                            Net Payroll
                        </th>

                        <th className="px-4 py-3">
                            Status
                        </th>

                        <th className="px-4 py-3 text-right">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-border">
                    {payrolls.map((payroll) => (
                        <MonthlyPayrollTableRow
                            key={payroll.id}
                            payroll={payroll}
                            onClick={onPayrollClick}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MonthlyPayrollTable;
