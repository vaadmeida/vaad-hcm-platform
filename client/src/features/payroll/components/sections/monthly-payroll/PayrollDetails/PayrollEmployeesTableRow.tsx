import type { PayrollEmployeeRecord } from "@/features/payroll/types/payroll.types";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

interface PayrollEmployeesTableRowProps {
    employee: PayrollEmployeeRecord;
}

const formatCurrency = (amount: string | number) =>
    `₦${Number(amount).toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

const PayrollEmployeesTableRow = ({
    employee,
}: PayrollEmployeesTableRowProps) => {
    return (
        <tr className="transition-colors hover:bg-muted/20">
            <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 shrink-0">
                        <AvatarImage
                            src={employee.employee?.avatar_url ?? undefined}
                            alt={employee.employeeName}
                        />
                        <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                            {employee.employeeName
                                .split(" ")
                                .slice(0, 2)
                                .map((name) => name[0])
                                .join("")
                                .toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                        <div className="truncate font-medium text-gray-900">
                            {employee.employeeName}
                        </div>

                        <div className="text-xs text-muted-foreground">
                            {employee.employeeNumber || "N/A"}
                        </div>
                    </div>
                </div>
            </td>
            <td className="hidden px-4 py-3 text-gray-600 lg:table-cell">
                {employee.departmentNames.join(", ") || "N/A"}
            </td>

            <td className="px-4 py-3 font-medium text-gray-700">
                {formatCurrency(employee.grossPay)}
            </td>

            <td className="hidden px-4 py-3 text-gray-600 xl:table-cell">
                {formatCurrency(employee.additionalEarnings)}
            </td>

            <td className="hidden px-4 py-3 text-gray-600 lg:table-cell">
                {formatCurrency(employee.paye)}
            </td>

            <td className="px-4 py-3 font-semibold text-gray-900">
                {formatCurrency(employee.netPay)}
            </td>
        </tr>
    );
};

export default PayrollEmployeesTableRow;