
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import {
    CalendarIcon,
    Check,
    ChevronsUpDown,
    Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

import { cn } from "@/lib/utils";

import { useCreateEmployeeSalary } from "../../hooks/useCreateEmployeeSalary";
import { useGetEmployeesWithSalary } from "../../hooks/useGetEmployeesWithSalary";

const salaryFormSchema = z.object({
    employeeId: z.string().uuid("Please select an employee"),
    annualBaseSalary: z.coerce
        .number()
        .positive("Annual base salary must be greater than zero"),
    effectiveDate: z.string().min(1, "Effective date is required"),
    paye: z.coerce.number().min(0, "PAYE cannot be negative"),
});

type SalaryFormInput = z.input<typeof salaryFormSchema>;
type SalaryFormValues = z.output<typeof salaryFormSchema>;

interface AddEmployeeSalaryFormProps {
    onSuccess: () => void;
}

const AddEmployeeSalaryForm = ({
    onSuccess,
}: AddEmployeeSalaryFormProps) => {
    const createSalaryMutation = useCreateEmployeeSalary();

    // Employee dropdown state
    const [employeeOpen, setEmployeeOpen] = useState(false);
    const [employeeSearch, setEmployeeSearch] = useState("");
    const [employeePage, setEmployeePage] = useState(1);
    const [selectedEmployee, setSelectedEmployee] = useState<{
        employeeId: string;
        employeeName: string;
        employeeCode: string | null;
    } | null>(null);

    // Date picker state
    const [datePickerOpen, setDatePickerOpen] = useState(false);

    // Fetch employees
    const {
        data: employeesResponse,
        isLoading: isLoadingEmployees,
        isFetching: isFetchingEmployees,
        isError: isEmployeesError,
    } = useGetEmployeesWithSalary({
        page: employeePage,
        search: employeeSearch.trim() || undefined,
        salaryStatus: "NOT_CONFIGURED",
    });

    const employees = employeesResponse?.data ?? [];
    const pagination = employeesResponse?.pagination;

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<SalaryFormInput, unknown, SalaryFormValues>({
        resolver: zodResolver(salaryFormSchema),
        defaultValues: {
            employeeId: "",
            annualBaseSalary: 0,
            effectiveDate: format(new Date(), "yyyy-MM-dd"),
            paye: 0,
        },
    });

    const onSubmit = (values: SalaryFormValues) => {
        const { employeeId, ...payload } = values;

        createSalaryMutation.mutate(
            {
                employeeId,
                payload,
            },
            {
                onSuccess: () => {
                    reset();
                    setSelectedEmployee(null);
                    setEmployeeSearch("");
                    setEmployeePage(1);
                    setEmployeeOpen(false);
                    setDatePickerOpen(false);
                    onSuccess();
                },
            }
        );
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* Employee */}
                <div className="space-y-2">
                    <Label htmlFor="employeeId">Employee</Label>

                    <Controller
                        name="employeeId"
                        control={control}
                        render={({ field }) => (
                            <Popover
                                open={employeeOpen}
                                onOpenChange={setEmployeeOpen}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={employeeOpen}
                                        className={cn(
                                            "w-full justify-between border-gray-200 bg-white font-normal shadow-none hover:bg-gray-50",
                                            !field.value && "text-muted-foreground"
                                        )}
                                    >
                                        <span className="truncate">
                                            {selectedEmployee?.employeeName ??
                                                "Select employee"}
                                        </span>

                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent
                                    align="start"
                                    className="w-[--radix-popover-trigger-width] border border-gray-200 bg-white p-0 shadow-lg">
                                    <Command shouldFilter={false}>
                                        <CommandInput
                                            placeholder="Search employee..."
                                            value={employeeSearch}
                                            onValueChange={(value) => {
                                                setEmployeeSearch(value);
                                                setEmployeePage(1);
                                            }}
                                        />

                                        <CommandList>
                                            {isLoadingEmployees ||
                                                isFetchingEmployees ? (
                                                <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Searching employees...
                                                </div>
                                            ) : isEmployeesError ? (
                                                <div className="py-6 text-center text-sm text-destructive">
                                                    Failed to load employees.
                                                </div>
                                            ) : (
                                                <>
                                                    <CommandEmpty>
                                                        No eligible employees found.
                                                    </CommandEmpty>

                                                    <CommandGroup heading="Employees">
                                                        {employees.map((employee) => (
                                                            <CommandItem
                                                                key={employee.employeeId}
                                                                value={employee.employeeId}
                                                                onSelect={() => {
                                                                    field.onChange(
                                                                        employee.employeeId
                                                                    );

                                                                    setSelectedEmployee({
                                                                        employeeId: employee.employeeId,
                                                                        employeeName: employee.employeeName,
                                                                        employeeCode: employee.employeeCode,
                                                                    });

                                                                    setEmployeeOpen(false);
                                                                    setEmployeeSearch("");
                                                                    setEmployeePage(1);
                                                                }}
                                                                className="cursor-pointer"
                                                            >
                                                                <div className="flex min-w-0 flex-1 flex-col">
                                                                    <span className="truncate font-medium">
                                                                        {employee.employeeName}
                                                                    </span>

                                                                    <span className="text-xs text-muted-foreground">
                                                                        {employee.employeeCode ??
                                                                            "No employee code"}
                                                                    </span>
                                                                </div>

                                                                <Check
                                                                    className={cn(
                                                                        "ml-auto h-4 w-4",
                                                                        field.value === employee.employeeId
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </>
                                            )}
                                        </CommandList>

                                        {/* Pagination */}
                                        {pagination && pagination.totalPages > 1 && (
                                            <div className="flex items-center justify-between border-t border-gray-100 p-2">
                                                <span className="text-xs text-muted-foreground">
                                                    Page {pagination.page} of{" "}
                                                    {pagination.totalPages}
                                                </span>

                                                <div className="flex gap-1">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        disabled={
                                                            !pagination.hasPreviousPage ||
                                                            isFetchingEmployees
                                                        }
                                                        onClick={() =>
                                                            setEmployeePage((page) =>
                                                                Math.max(1, page - 1)
                                                            )
                                                        }
                                                    >
                                                        Previous
                                                    </Button>

                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        disabled={
                                                            !pagination.hasNextPage ||
                                                            isFetchingEmployees
                                                        }
                                                        onClick={() =>
                                                            setEmployeePage((page) => page + 1)
                                                        }
                                                    >
                                                        Next
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        )}
                    />

                    {errors.employeeId && (
                        <p className="text-xs text-destructive">
                            {errors.employeeId.message}
                        </p>
                    )}
                </div>

                {/* Annual Base Salary */}
                <div className="space-y-2">
                    <Label htmlFor="annualBaseSalary">
                        Annual Base Salary (₦)
                    </Label>

                    <Input
                        id="annualBaseSalary"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="e.g. 1500000"
                        className="border-gray-200 bg-white shadow-none focus-visible:border-gray-300 focus-visible:ring-2 focus-visible:ring-gray-100"
                        {...register("annualBaseSalary")}
                    />

                    {errors.annualBaseSalary && (
                        <p className="text-xs text-destructive">
                            {errors.annualBaseSalary.message}
                        </p>
                    )}
                </div>

                {/* Effective Date */}
                <div className="space-y-2">
                    <Label htmlFor="effectiveDate">Effective Date</Label>

                    <Controller
                        name="effectiveDate"
                        control={control}
                        render={({ field }) => (
                            <Popover
                                open={datePickerOpen}
                                onOpenChange={setDatePickerOpen}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full justify-start border-gray-200 bg-white text-left font-normal shadow-none hover:bg-gray-50"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />

                                        {field.value
                                            ? format(
                                                new Date(`${field.value}T12:00:00`),
                                                "PPP"
                                            )
                                            : "Select effective date"}
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent
                                    className="w-auto border border-gray-200 bg-white p-0 shadow-lg"
                                    align="start"
                                >
                                    <Calendar
                                        mode="single"
                                        selected={
                                            field.value
                                                ? new Date(`${field.value}T12:00:00`)
                                                : undefined
                                        }
                                        onSelect={(date) => {
                                            if (date) {
                                                field.onChange(
                                                    format(date, "yyyy-MM-dd")
                                                );
                                                setDatePickerOpen(false);
                                            }
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        )}
                    />

                    {errors.effectiveDate && (
                        <p className="text-xs text-destructive">
                            {errors.effectiveDate.message}
                        </p>
                    )}
                </div>

                {/* Monthly PAYE */}
                <div className="space-y-2">
                    <Label htmlFor="paye">Monthly PAYE (₦)</Label>

                    <Input
                        id="paye"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="e.g. 5000"
                        className="border-gray-200 bg-white shadow-none focus-visible:border-gray-300 focus-visible:ring-2 focus-visible:ring-gray-100"
                        {...register("paye")}
                    />

                    {errors.paye && (
                        <p className="text-xs text-destructive">
                            {errors.paye.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
                <Button
                    type="submit"
                    disabled={createSalaryMutation.isPending}
                    className="min-w-32 text-white cursor-pointer"
                >
                    {createSalaryMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}

                    {createSalaryMutation.isPending
                        ? "Saving..."
                        : "Create Salary"}
                </Button>
            </div>
        </form>
    );
};

export default AddEmployeeSalaryForm;
