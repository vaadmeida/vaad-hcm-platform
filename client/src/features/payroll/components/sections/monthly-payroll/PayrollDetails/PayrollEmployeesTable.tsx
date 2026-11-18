import type { PayrollEmployeeRecord } from "@/features/payroll/types/payroll.types";
import PayrollEmployeesTableRow from "./PayrollEmployeesTableRow";

interface PayrollEmployeesTableProps {
    employees: PayrollEmployeeRecord[];
}

const PayrollEmployeesTable = ({
    employees,
}: PayrollEmployeesTableProps) => {
    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr className="border-y border-border bg-muted/10 text-left text-xs font-medium text-muted-foreground">
                        <th className="px-4 py-3">Employee</th>

                        <th className="hidden px-4 py-3 lg:table-cell">
                            Department
                        </th>

                        <th className="px-4 py-3">Gross Pay</th>

                        <th className="hidden px-4 py-3 xl:table-cell">
                            Earnings
                        </th>

                        <th className="hidden px-4 py-3 lg:table-cell">
                            PAYE
                        </th>

                        <th className="px-4 py-3">Net Pay</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-border">
                    {employees.length > 0 ? (
                        employees.map((employee) => (
                            <PayrollEmployeesTableRow
                                key={employee.id}
                                employee={employee}
                            />
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={7}
                                className="px-4 py-10 text-center text-sm text-muted-foreground"
                            >
                                No payroll employees found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PayrollEmployeesTable;