
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { usePreparePayroll } from "@/features/payroll/hooks/usePreparePayroll";
import type { PreparePayrollInput } from "@/features/payroll/types/payroll.types";

interface PreparePayrollFormProps {
    onSuccess: () => void;
}

const currentDate = new Date();
const currentYear = currentDate.getFullYear();

const preparePayrollSchema = z.object({
    month: z.number().min(1, "Select a payroll month").max(12),
    year: z.number().min(2020, "Invalid payroll year"),
});

type PreparePayrollFormValues = z.infer<typeof preparePayrollSchema>;

const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
];

const years = Array.from(
    { length: 5 },
    (_, index) => currentYear - index
);

const PreparePayrollForm = ({ onSuccess }: PreparePayrollFormProps) => {
    const { mutate: preparePayroll, isPending } = usePreparePayroll();

    const form = useForm<PreparePayrollFormValues>({
        resolver: zodResolver(preparePayrollSchema),
        defaultValues: {
            month: currentDate.getMonth() + 1,
            year: currentYear,
        },
    });

    const selectedYear = useWatch({
        control: form.control,
        name: "year",
    });

    const selectedMonth = useWatch({
        control: form.control,
        name: "month",
    });

    const onSubmit = (values: PreparePayrollFormValues) => {
        const payload: PreparePayrollInput = {
            month: values.month,
            year: values.year,
        };

        preparePayroll(payload, {
            onSuccess: (response) => {
                toast.success(
                    response.message || "Payroll prepared successfully."
                );
                onSuccess();
            },
            onError: (error: unknown) => {
                const message = axios.isAxiosError<{ message?: string }>(error)
                    ? error.response?.data?.message
                    : undefined;

                toast.error(
                    message || "Failed to prepare payroll. Please try again."
                );
            },
        });
    };

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
        >
            <div className="grid grid-cols-2 gap-4">
                {/* Payroll Year */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        Payroll Year
                    </label>

                    <Select
                        value={String(selectedYear)}
                        onValueChange={(value) =>
                            form.setValue("year", Number(value), {
                                shouldValidate: true,
                            })
                        }
                        disabled={isPending}
                    >
                        <SelectTrigger className="w-full border-gray-200">
                            <SelectValue placeholder="Select year" />
                        </SelectTrigger>

                        <SelectContent>
                            {years.map((year) => (
                                <SelectItem
                                    key={year}
                                    value={String(year)}
                                >
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {form.formState.errors.year && (
                        <p className="text-sm text-destructive">
                            {form.formState.errors.year.message}
                        </p>
                    )}
                </div>

                {/* Payroll Month */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        Payroll Month
                    </label>

                    <Select
                        value={String(selectedMonth)}
                        onValueChange={(value) =>
                            form.setValue("month", Number(value), {
                                shouldValidate: true,
                            })
                        }
                        disabled={isPending}
                    >
                        <SelectTrigger className="w-full border-gray-200">
                            <SelectValue placeholder="Select month" />
                        </SelectTrigger>

                        <SelectContent className="border border-gray-100">
                            {months.map((month) => (
                                <SelectItem
                                    key={month.value}
                                    value={String(month.value)}
                                >
                                    {month.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {form.formState.errors.month && (
                        <p className="text-sm text-destructive">
                            {form.formState.errors.month.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onSuccess}
                    disabled={isPending}
                >
                    Cancel
                </Button>

                <Button type="submit" disabled={isPending} className="text-white cursor-pointer">
                    {isPending ? "Preparing..." : "Prepare Payroll"}
                </Button>
            </div>
        </form>
    );
};

export default PreparePayrollForm;
