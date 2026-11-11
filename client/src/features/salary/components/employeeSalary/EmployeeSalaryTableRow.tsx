
import { MoreHorizontal, Eye, Plus, Pencil } from "lucide-react";
import type { EmployeeWithSalary } from "@/features/salary/types/salary.types";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface EmployeeSalaryTableRowProps {
    employee: EmployeeWithSalary;
    onViewSalary: (employeeId: string) => void;
    onReviewSalary: (employeeId: string) => void;
  onAddSalary: (employee: EmployeeWithSalary) => void;
}

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
    }).format(amount);

const getInitials = (firstName: string, lastName: string) =>
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

const EmployeeSalaryTableRow = ({
    employee,
    onViewSalary,
    onReviewSalary,
    onAddSalary,    
}: EmployeeSalaryTableRowProps) => {
    const salary = employee.salary;

    const statusStyles = {
        ACTIVE: "bg-green-50 text-green-700 border-green-200",
        ENDED: "bg-gray-100 text-gray-600 border-gray-200",
        NOT_CONFIGURED: "bg-amber-50 text-amber-700 border-amber-200",
    };

    const statusLabels = {
        ACTIVE: "Active",
        ENDED: "Ended",
        NOT_CONFIGURED: "Not Configured",
    };

    return (
        <tr className="transition-colors hover:bg-muted/5">
            {/* Employee */}
            <td className="px-4 py-3 pr-2">
                <div className="flex items-center gap-3 min-w-47.5">
                    <Avatar className="h-9 w-9">
                        <AvatarImage
                            src={employee.avatarUrl ?? undefined}
                            alt={employee.employeeName}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                            {getInitials(employee.firstName, employee.lastName)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">
                            {employee.employeeName}
                        </p>

                        <p className="text-xs text-muted-foreground">
                            {employee.employeeCode || "No employee ID"}
                        </p>
                    </div>
                </div>
            </td>

            {/* Annual Base Salary */}
            <td className="hidden px-4 py-3 whitespace-nowrap xl:table-cell">
                {salary ? formatCurrency(salary.annualBaseSalary) : "—"}
            </td>

            {/* Monthly Gross */}
            <td className="hidden px-4 py-3 whitespace-nowrap xl:table-cell">
                {salary ? formatCurrency(salary.monthlyGross) : "—"}
            </td>

            {/* Net Pay */}
            <td className="px-4 py-3 whitespace-nowrap font-medium">
                {salary ? formatCurrency(salary.netPay) : "—"}
            </td>

            {/* Salary Status */}
            <td className="hidden px-4 py-3 xl:table-cell">
                <Badge
                    variant="outline"
                    className={statusStyles[employee.salaryStatus]}
                >
                    {statusLabels[employee.salaryStatus]}
                </Badge>
            </td>

            {/* Actions */}
            <td className="px-4 py-3 text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open actions</span>
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        sideOffset={6}
                        className="w-48 rounded-xl border border-border bg-white p-1.5 shadow-lg">
                        {salary ? (
                            <>
                                <DropdownMenuItem
                                    onClick={() => onViewSalary(employee.employeeId)}
                                    className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-foreground focus:bg-muted/10"
                                >
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                    <span>View Salary</span>
                                </DropdownMenuItem>

                                {employee.salaryStatus === "ACTIVE" && (
                                    <DropdownMenuItem
                                       onClick={() => onReviewSalary(employee.employeeId)}
                                        className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-foreground focus:bg-muted/10"
                                    >
                                        <Pencil className="h-4 w-4 text-muted-foreground" />
                                        <span>Review Salary</span>
                                    </DropdownMenuItem>
                                )}
                            </>
                        ) : (
                            <DropdownMenuItem
                                onClick={() => onAddSalary(employee)}
                                className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-primary focus:bg-primary/5 focus:text-primary"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Add Salary</span>
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </td>
        </tr>
    );
};

export default EmployeeSalaryTableRow;
