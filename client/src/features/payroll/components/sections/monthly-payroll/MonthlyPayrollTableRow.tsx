
import type { MonthlyPayroll } from "@/features/payroll/types/payroll.types";
import { MoreHorizontal, Eye } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MonthlyPayrollTableRowProps {
    payroll: MonthlyPayroll;
    onClick: (payrollId: string) => void;
}

const MonthlyPayrollTableRow = ({
    payroll,
    onClick,
}: MonthlyPayrollTableRowProps) => {


    const formatCurrency = (amount: string | number) =>
        new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(Number(amount));

    const getMonthName = (month: number) =>
        new Date(2000, month - 1).toLocaleString("en-US", {
            month: "long",
        });

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "PROCESSED":
                return "bg-green-50 text-green-700";

            case "APPROVED":
                return "bg-blue-50 text-blue-700";

            case "REVIEWED":
                return "bg-indigo-50 text-indigo-700";

            case "CALCULATED":
                return "bg-amber-50 text-amber-700";

            case "DRAFT":
                return "bg-gray-50 text-gray-600";

            default:
                return "bg-gray-50 text-gray-600";
        }
    };

    const getStatusDot = (status: string) => {
        switch (status) {
            case "PROCESSED":
                return "bg-green-500";

            case "APPROVED":
                return "bg-blue-500";

            case "REVIEWED":
                return "bg-indigo-500";

            case "CALCULATED":
                return "bg-amber-500";

            case "DRAFT":
                return "bg-gray-400";

            default:
                return "bg-gray-400";
        }
    };

    return (
        <tr
            onClick={() => onClick(payroll.id)}
            className="cursor-pointer last:border-none hover:bg-gray-50"
        >
            {/* Payroll Period */}
            <td className="px-4 py-3">
                <div>
                    <p className="text-sm font-medium text-gray-900">
                        {getMonthName(payroll.month)} {payroll.year}
                    </p>

                    <p className="text-xs text-muted-foreground">
                        Payroll
                    </p>
                </div>
            </td>

            {/* Employees */}
            <td className="hidden px-4 py-3 xl:table-cell">
                <span className="text-sm text-gray-700">
                    {payroll.totalEmployees}
                </span>
            </td>

            {/* Gross Payroll */}
            <td className="px-4 py-3">
                <span className="whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(payroll.totalGross)}
                </span>
            </td>

            {/* PAYE */}
            <td className="hidden px-4 py-3 lg:table-cell">
                <span className="whitespace-nowrap text-sm text-gray-700">
                    {formatCurrency(payroll.totalPaye)}
                </span>
            </td>

            {/* Net Payroll */}
            <td className="px-4 py-3">
                <span className="whitespace-nowrap text-sm font-semibold text-gray-900">
                    {formatCurrency(payroll.totalNetPay)}
                </span>
            </td>

            {/* Status */}
            <td className="px-4 py-3">
                <span
                    className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${getStatusStyles(
                        payroll.status
                    )}`}
                >
                    <span
                        className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                            payroll.status
                        )}`}
                    />

                    {payroll.status.toLowerCase()}
                </span>
            </td>

            {/* Actions */}
            <td
                className="px-3 py-3 text-center"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex justify-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                aria-label="Payroll actions"
                                onClick={(event) => event.stopPropagation()}
                                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-gray-100 hover:text-gray-900"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="end"
                            className="w-42 bg-white py-2"
                        >
                            <DropdownMenuItem
                                onSelect={() => onClick(payroll.id)}
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                View payroll
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </td>
        </tr>
    );
};

export default MonthlyPayrollTableRow;
