import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addDays, format, startOfDay } from "date-fns";
import {
    CalendarIcon,
    Loader2,
    Plus,
    Pencil,
    Trash2,
} from "lucide-react";

import type { EmployeeWithSalary } from "../../types/salary.types";
import type { ReviewEmployeeSalaryDTO } from "../../types/salary.types";

import { useEmployeeSalary } from "../../hooks/useEmployeeSalary";
import { useReviewEmployeeSalary } from "../../hooks/useReviewEmployeeSalary";

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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const VAAD_BLUE = "#1078A9";

type AdditionalEarningFrequency = "MONTHLY" | "ANNUAL" | "ONE_TIME";

type CalculationBaseType =
    | "BASIC_SALARY"
    | "GROSS_SALARY"
    | "HOUSING_ALLOWANCE"
    | "TRANSPORT_ALLOWANCE"
    | "MEDICAL_ALLOWANCE"
    | "MEAL_ALLOWANCE"
    | "WARDROBE_ALLOWANCE"
    | "CUSTOM_AMOUNT";

interface SalaryEarningRecord {
    id?: string;
    salaryId?: string;
    name: string;
    amount: number | string;
    frequency: AdditionalEarningFrequency;
    calculationType?: "FIXED" | "PERCENTAGE";
    percentage?: number | string | null;
    calculationBase?: number | string | null;
    calculationBaseType?: CalculationBaseType | null;
}

const SYSTEM_EARNINGS = ["Leave Allowance", "13th Month"];

const calculationBaseOptions: {
    value: CalculationBaseType;
    label: string;
}[] = [
    { value: "GROSS_SALARY", label: "Gross Salary" },
    { value: "BASIC_SALARY", label: "Basic Salary" },
    { value: "HOUSING_ALLOWANCE", label: "Housing Allowance" },
    { value: "TRANSPORT_ALLOWANCE", label: "Transport Allowance" },
    { value: "MEDICAL_ALLOWANCE", label: "Medical Allowance" },
    { value: "MEAL_ALLOWANCE", label: "Meal Allowance" },
    { value: "WARDROBE_ALLOWANCE", label: "Wardrobe Allowance" },
    { value: "CUSTOM_AMOUNT", label: "Custom Amount" },
];

const additionalEarningSchema = z
    .object({
        name: z.string().trim().min(1, "Earning name is required"),
        calculationType: z.enum(["FIXED", "PERCENTAGE"]),
        amount: z.coerce.number().finite().min(0).optional(),
        percentage: z.coerce.number().finite().gt(0).max(100).optional(),
        calculationBaseType: z
            .enum([
                "BASIC_SALARY",
                "GROSS_SALARY",
                "HOUSING_ALLOWANCE",
                "TRANSPORT_ALLOWANCE",
                "MEDICAL_ALLOWANCE",
                "MEAL_ALLOWANCE",
                "WARDROBE_ALLOWANCE",
                "CUSTOM_AMOUNT",
            ])
            .optional(),
        calculationBase: z.coerce.number().finite().positive().optional(),
        frequency: z.enum(["MONTHLY", "ANNUAL", "ONE_TIME"]),
    })
    .superRefine((earning, ctx) => {
        if (earning.calculationType === "FIXED") {
            if (earning.amount == null || !Number.isFinite(earning.amount)) {
                ctx.addIssue({
                    code: "custom",
                    path: ["amount"],
                    message: "Enter a valid earning amount",
                });
            }

            return;
        }

        if (
            earning.percentage == null ||
            !Number.isFinite(earning.percentage)
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["percentage"],
                message: "Enter a percentage between 0 and 100",
            });
        }

        if (!earning.calculationBaseType) {
            ctx.addIssue({
                code: "custom",
                path: ["calculationBaseType"],
                message: "Select a calculation base",
            });
        }

        if (
            earning.calculationBaseType === "CUSTOM_AMOUNT" &&
            (earning.calculationBase == null ||
                !Number.isFinite(earning.calculationBase) ||
                earning.calculationBase <= 0)
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["calculationBase"],
                message: "Enter a valid custom calculation base",
            });
        }
    });

const reviewSalarySchema = z.object({
    annualBaseSalary: z.coerce
        .number()
        .finite("Enter a valid salary amount")
        .positive("Annual base salary must be greater than zero"),

    effectiveDate: z.string().min(1, "Effective date is required"),

    paye: z.coerce
        .number()
        .finite("Enter a valid PAYE amount")
        .min(0, "PAYE cannot be negative"),

    additionalEarnings: z.array(additionalEarningSchema).default([]),
});

type ReviewSalaryInput = z.input<typeof reviewSalarySchema>;
type ReviewSalaryValues = z.output<typeof reviewSalarySchema>;

type EarningDraft = {
    name: string;
    calculationType: "FIXED" | "PERCENTAGE";
    amount: string;
    percentage: string;
    calculationBaseType: CalculationBaseType | "";
    calculationBase: string;
    frequency: AdditionalEarningFrequency;
};

interface ReviewEmployeeSalaryFormProps {
    employee: EmployeeWithSalary;
    onSuccess: () => void;
}

const inputClassName =
    "border-gray-200 bg-white shadow-none focus-visible:border-[#1078A9] focus-visible:ring-2 focus-visible:ring-[#1078A9]/10";

const selectClassName =
    "flex h-9 w-full rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-none outline-none focus-visible:border-[#1078A9] focus-visible:ring-2 focus-visible:ring-[#1078A9]/10";

const emptyEarningDraft: EarningDraft = {
    name: "",
    calculationType: "FIXED",
    amount: "",
    percentage: "",
    calculationBaseType: "BASIC_SALARY",
    calculationBase: "",
    frequency: "MONTHLY",
};

const formatCurrency = (amount: number) =>
    `₦${amount.toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

const ReviewEmployeeSalaryForm = ({
    employee,
    onSuccess,
}: ReviewEmployeeSalaryFormProps) => {
    const [currentStep, setCurrentStep] = useState<1 | 2>(1);
    const [datePickerOpen, setDatePickerOpen] = useState(false);

    const [earningDialogOpen, setEarningDialogOpen] = useState(false);
    const [editingEarningIndex, setEditingEarningIndex] = useState<
        number | null
    >(null);

    const [earningDraft, setEarningDraft] =
        useState<EarningDraft>(emptyEarningDraft);

    const [earningDraftErrors, setEarningDraftErrors] = useState<
        Record<string, string>
    >({});

    // Fetch the employee's complete salary record.
    const {
        data: salaryResponse,
        isLoading: isLoadingSalary,
        isError: isSalaryError,
    } = useEmployeeSalary(employee.employeeId);

    const currentSalary = salaryResponse?.data;

    const reviewSalaryMutation = useReviewEmployeeSalary();

    const {
        register,
        control,
        handleSubmit,
        trigger,
        reset,
        formState: { errors },
    } = useForm<ReviewSalaryInput, unknown, ReviewSalaryValues>({
        resolver: zodResolver(reviewSalarySchema),
        defaultValues: {
            annualBaseSalary: 0,
            effectiveDate: format(new Date(), "yyyy-MM-dd"),
            paye: 0,
            additionalEarnings: [],
        },
    });

    const {
        fields: earningFields,
        append: appendEarning,
        update: updateEarning,
        remove: removeEarning,
    } = useFieldArray({
        control,
        name: "additionalEarnings",
    });

    const additionalEarnings = useWatch({
        control,
        name: "additionalEarnings",
    });

    const annualBaseSalary = Number(
        useWatch({ control, name: "annualBaseSalary" }) ?? 0
    );

    // Populate the form when the full salary record is loaded.
    useEffect(() => {
        if (!currentSalary) return;

        const existingEarnings = (
            currentSalary.additionalEarnings ?? []
        ) as SalaryEarningRecord[];

        const customEarnings = existingEarnings
            .filter((earning) => !SYSTEM_EARNINGS.includes(earning.name))
            .map((earning) => ({
                name: earning.name,
                calculationType: earning.calculationType ?? "FIXED",
                amount:
                    earning.amount != null ? Number(earning.amount) : undefined,
                percentage:
                    earning.percentage != null
                        ? Number(earning.percentage)
                        : undefined,
                calculationBaseType:
                    earning.calculationBaseType ?? undefined,
                calculationBase:
                    earning.calculationBase != null
                        ? Number(earning.calculationBase)
                        : undefined,
                frequency: earning.frequency,
            }));

        const currentEffectiveDate = new Date(currentSalary.effectiveDate);

        reset({
            annualBaseSalary: Number(currentSalary.annualBaseSalary),
            paye: Number(currentSalary.paye),
            effectiveDate: format(
                addDays(currentEffectiveDate, 1),
                "yyyy-MM-dd"
            ),
            additionalEarnings: customEarnings,
        });
    }, [currentSalary, reset]);

    const handleAddEarning = () => {
        setEditingEarningIndex(null);
        setEarningDraft(emptyEarningDraft);
        setEarningDraftErrors({});
        setEarningDialogOpen(true);
    };

    const handleEditEarning = (index: number) => {
        const earning = additionalEarnings?.[index];

        if (!earning) return;

        setEditingEarningIndex(index);

        setEarningDraft({
            name: earning.name,
            calculationType: earning.calculationType,
            amount: earning.amount != null ? String(earning.amount) : "",
            percentage:
                earning.percentage != null
                    ? String(earning.percentage)
                    : "",
            calculationBaseType:
                earning.calculationBaseType ?? "BASIC_SALARY",
            calculationBase:
                earning.calculationBase != null
                    ? String(earning.calculationBase)
                    : "",
            frequency: earning.frequency,
        });

        setEarningDraftErrors({});
        setEarningDialogOpen(true);
    };

    const handleSaveEarning = () => {
        const result = additionalEarningSchema.safeParse({
            name: earningDraft.name,
            calculationType: earningDraft.calculationType,
            amount:
                earningDraft.amount.trim() === ""
                    ? undefined
                    : Number(earningDraft.amount),
            percentage:
                earningDraft.percentage.trim() === ""
                    ? undefined
                    : Number(earningDraft.percentage),
            calculationBaseType:
                earningDraft.calculationBaseType || undefined,
            calculationBase:
                earningDraft.calculationBase.trim() === ""
                    ? undefined
                    : Number(earningDraft.calculationBase),
            frequency: earningDraft.frequency,
        });

        if (!result.success) {
            const nextErrors: Record<string, string> = {};

            result.error.issues.forEach((issue) => {
                const field = String(issue.path[0]);

                if (!nextErrors[field]) {
                    nextErrors[field] = issue.message;
                }
            });

            setEarningDraftErrors(nextErrors);
            return;
        }

        if (editingEarningIndex !== null) {
            updateEarning(editingEarningIndex, result.data);
        } else {
            appendEarning(result.data);
        }

        setEarningDialogOpen(false);
        setEarningDraft(emptyEarningDraft);
        setEditingEarningIndex(null);
        setEarningDraftErrors({});
    };

    const handleContinue = async () => {
        const isValid = await trigger([
            "annualBaseSalary",
            "effectiveDate",
            "paye",
        ]);

        if (isValid) {
            setCurrentStep(2);
        }
    };

    const handleBack = () => {
        setCurrentStep(1);
    };

    const onSubmit = (values: ReviewSalaryValues) => {
        const payload: ReviewEmployeeSalaryDTO = {
            annualBaseSalary: values.annualBaseSalary,
            effectiveDate: values.effectiveDate,
            paye: values.paye,

            additionalEarnings: values.additionalEarnings.map((earning) => {
                if (earning.calculationType === "FIXED") {
                    return {
                        name: earning.name,
                        calculationType: "FIXED" as const,
                        amount: earning.amount!,
                        frequency: earning.frequency,
                    };
                }

                return {
                    name: earning.name,
                    calculationType: "PERCENTAGE" as const,
                    percentage: earning.percentage!,
                    calculationBaseType: earning.calculationBaseType!,
                    ...(earning.calculationBaseType === "CUSTOM_AMOUNT"
                        ? { calculationBase: earning.calculationBase! }
                        : {}),
                    frequency: earning.frequency,
                };
            }),
        };

        reviewSalaryMutation.mutate(
            {
                employeeId: employee.employeeId,
                payload,
            },
            {
                onSuccess: () => {
                    onSuccess();
                },
            }
        );
    };

    // Frontend estimate only. Backend remains the source of truth.
    const annualComponentShares: Record<
        Exclude<CalculationBaseType, "CUSTOM_AMOUNT">,
        number
    > = {
        GROSS_SALARY: 1,
        BASIC_SALARY: 0.22,
        HOUSING_ALLOWANCE: 0.2,
        TRANSPORT_ALLOWANCE: 0.2,
        MEDICAL_ALLOWANCE: 0.18,
        MEAL_ALLOWANCE: 0.1,
        WARDROBE_ALLOWANCE: 0.1,
    };

    const selectedAnnualBase =
        earningDraft.calculationBaseType === "CUSTOM_AMOUNT"
            ? Number(earningDraft.calculationBase)
            : earningDraft.calculationBaseType
              ? annualBaseSalary *
                annualComponentShares[earningDraft.calculationBaseType]
              : 0;

    const selectedCalculationBase =
        earningDraft.calculationBaseType === "CUSTOM_AMOUNT"
            ? selectedAnnualBase
            : earningDraft.frequency === "ANNUAL"
              ? selectedAnnualBase
              : selectedAnnualBase / 12;

    const estimatedAmount =
        earningDraft.calculationType === "PERCENTAGE" &&
        Number(earningDraft.percentage) > 0 &&
        selectedCalculationBase > 0
            ? (selectedCalculationBase * Number(earningDraft.percentage)) /
              100
            : null;

    const selectedBaseLabel = calculationBaseOptions.find(
        (option) => option.value === earningDraft.calculationBaseType
    )?.label;

    if (isLoadingSalary) {
        return (
            <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading employee salary details...
            </div>
        );
    }

    if (isSalaryError || !currentSalary) {
        return (
            <div className="space-y-3 py-5 text-center">
                <p className="text-sm font-medium text-red-600">
                    Unable to load this employee's salary details.
                </p>
                <p className="text-xs text-gray-500">
                    Please close this window and try again.
                </p>
            </div>
        );
    }

    return (
        <>
            <form
                onSubmit={(event) => {
                    event.preventDefault();

                    if (currentStep === 1) {
                        void handleContinue();
                        return;
                    }

                    void handleSubmit(onSubmit)(event);
                }}
                className="space-y-4"
            >
                {/* Employee information */}
                <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2.5">
                    <p className="text-sm font-semibold text-gray-900">
                        {employee.employeeName}
                    </p>

                    <p className="mt-0.5 text-xs text-gray-500">
                        {employee.employeeCode || "No employee code"}
                    </p>
                </div>

                {/* Wizard progress */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span
                                className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold text-white"
                                style={{ backgroundColor: VAAD_BLUE }}
                            >
                                {currentStep}
                            </span>

                            <span className="text-sm font-semibold text-gray-900">
                                {currentStep === 1
                                    ? "Salary Details"
                                    : "Additional Earnings"}
                            </span>
                        </div>

                        <span className="text-xs text-gray-500">
                            Step {currentStep} of 2
                        </span>
                    </div>

                    <div className="h-1 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                                width: currentStep === 1 ? "50%" : "100%",
                                backgroundColor: VAAD_BLUE,
                            }}
                        />
                    </div>
                </div>

                {/* STEP 1: Salary details */}
                {currentStep === 1 && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="annualBaseSalary">
                                Annual Base Salary (₦)
                            </Label>

                            <Input
                                id="annualBaseSalary"
                                type="number"
                                min="0"
                                step="0.01"
                                className={inputClassName}
                                {...register("annualBaseSalary")}
                            />

                            {errors.annualBaseSalary && (
                                <p className="text-xs text-destructive">
                                    {errors.annualBaseSalary.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="effectiveDate">
                                Effective Date
                            </Label>

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
                                                          new Date(
                                                              `${field.value}T12:00:00`
                                                          ),
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
                                                        ? new Date(
                                                              `${field.value}T12:00:00`
                                                          )
                                                        : undefined
                                                }
                                                disabled={(date) =>
                                                    date <=
                                                    startOfDay(
                                                        new Date(
                                                            currentSalary.effectiveDate
                                                        )
                                                    )
                                                }
                                                onSelect={(date) => {
                                                    if (date) {
                                                        field.onChange(
                                                            format(
                                                                date,
                                                                "yyyy-MM-dd"
                                                            )
                                                        );

                                                        setDatePickerOpen(
                                                            false
                                                        );
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

                            <p className="text-[11px] text-gray-500">
                                The effective date must be later than the
                                current salary's effective date.
                            </p>
                        </div>

                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="paye">Monthly PAYE (₦)</Label>

                            <Input
                                id="paye"
                                type="number"
                                min="0"
                                step="0.01"
                                className={inputClassName}
                                {...register("paye")}
                            />

                            {errors.paye && (
                                <p className="text-xs text-destructive">
                                    {errors.paye.message}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* STEP 2: Additional earnings */}
                {currentStep === 2 && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                                <h3 className="text-sm font-semibold text-gray-900">
                                    Custom Earnings
                                </h3>

                                <p className="text-xs text-gray-500">
                                    Update bonuses, allowances or other
                                    additional earnings.
                                </p>
                            </div>

                            <Button
                                type="button"
                                size="sm"
                                onClick={handleAddEarning}
                                className="h-8 shrink-0 text-white hover:opacity-90"
                                style={{ backgroundColor: VAAD_BLUE }}
                            >
                                <Plus className="mr-1.5 h-3.5 w-3.5" />
                                Add earning
                            </Button>
                        </div>

                        {earningFields.length === 0 ? (
                            <div className="flex min-h-26 flex-col items-center justify-center rounded-md border border-dashed border-gray-200 px-4 py-5 text-center">
                                <p className="text-sm font-medium text-gray-700">
                                    No additional earnings
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    You can skip this section or add an earning.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100 rounded-md border border-gray-200">
                                {earningFields.map((earning, index) => {
                                    const currentEarning =
                                        additionalEarnings?.[index];

                                    if (!currentEarning) return null;

                                    const isPercentage =
                                        currentEarning.calculationType ===
                                        "PERCENTAGE";

                                    const earningValue = isPercentage
                                        ? `${Number(currentEarning.percentage ?? 0)}%`
                                        : formatCurrency(
                                              Number(
                                                  currentEarning.amount ?? 0
                                              )
                                          );

                                    const baseLabel =
                                        calculationBaseOptions.find(
                                            (option) =>
                                                option.value ===
                                                currentEarning.calculationBaseType
                                        )?.label;

                                    return (
                                        <div
                                            key={earning.id}
                                            className="flex items-center justify-between gap-3 px-3 py-2.5"
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-gray-800">
                                                    {currentEarning.name}
                                                </p>

                                                <p className="mt-0.5 text-xs text-gray-500">
                                                    {earningValue}
                                                    <span className="mx-1.5">
                                                        ·
                                                    </span>
                                                    {currentEarning.frequency.replace(
                                                        "_",
                                                        " "
                                                    )}

                                                    {isPercentage && (
                                                        <>
                                                            <span className="mx-1.5">
                                                                ·
                                                            </span>
                                                            {baseLabel ??
                                                                "Percentage"}
                                                        </>
                                                    )}
                                                </p>
                                            </div>

                                            <div className="flex shrink-0 items-center gap-1">
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-7 w-7 text-gray-500 hover:text-[#1078A9]"
                                                    onClick={() =>
                                                        handleEditEarning(index)
                                                    }
                                                    aria-label="Edit earning"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </Button>

                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-7 w-7 text-gray-400 hover:text-red-600"
                                                    onClick={() =>
                                                        removeEarning(index)
                                                    }
                                                    aria-label="Remove earning"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <p className="text-[11px] leading-4 text-gray-500">
                            Leave Allowance and 13th Month are calculated
                            automatically by the system and are not editable
                            here.
                        </p>
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                    {currentStep === 2 ? (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleBack}
                            className="h-9 border-gray-200"
                        >
                            Back
                        </Button>
                    ) : (
                        <span className="text-xs text-gray-400">
                            Step 1 of 2
                        </span>
                    )}

                    {currentStep === 1 ? (
                        <Button
                            type="button"
                            onClick={(event) => {
                               event.preventDefault();
                                event.stopPropagation();
                                void handleContinue();
                            }}
                            className="h-9 min-w-28 text-white hover:opacity-90"
                            style={{ backgroundColor: VAAD_BLUE }}
                        >
                            Continue
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            disabled={reviewSalaryMutation.isPending}
                            className="h-9 min-w-32 text-white hover:opacity-90"
                            style={{ backgroundColor: VAAD_BLUE }}
                        >
                            {reviewSalaryMutation.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}

                            {reviewSalaryMutation.isPending
                                ? "Saving..."
                                : "Review Salary"}
                        </Button>
                    )}
                </div>
            </form>

            {/* Add/Edit earning dialog */}
            <Dialog
                open={earningDialogOpen}
                onOpenChange={(open) => {
                    setEarningDialogOpen(open);

                    if (!open) {
                        setEarningDraftErrors({});
                        setEditingEarningIndex(null);
                    }
                }}
            >
                <DialogContent className="w-[calc(100%-2rem)] max-w-105 gap-4 bg-white p-4 sm:p-5">
                    <DialogHeader className="space-y-1">
                        <DialogTitle className="text-base">
                            {editingEarningIndex !== null
                                ? "Edit earning"
                                : "Add earning"}
                        </DialogTitle>

                        <DialogDescription className="text-xs">
                            Enter the details for this additional earning.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3">
                        {/* Earning name */}
                        <div className="space-y-1.5">
                            <Label htmlFor="earningName" className="text-xs">
                                Earning name
                            </Label>

                            <Input
                                id="earningName"
                                value={earningDraft.name}
                                onChange={(event) => {
                                    setEarningDraft((draft) => ({
                                        ...draft,
                                        name: event.target.value,
                                    }));

                                    setEarningDraftErrors((prev) => ({
                                        ...prev,
                                        name: "",
                                    }));
                                }}
                                placeholder="e.g. Performance Bonus"
                                className={inputClassName}
                            />

                            {earningDraftErrors.name && (
                                <p className="text-xs text-destructive">
                                    {earningDraftErrors.name}
                                </p>
                            )}
                        </div>

                        {/* Calculation and frequency */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="earningCalculationType"
                                    className="text-xs"
                                >
                                    Calculation
                                </Label>

                                <select
                                    id="earningCalculationType"
                                    className={selectClassName}
                                    value={earningDraft.calculationType}
                                    onChange={(event) => {
                                        setEarningDraft((draft) => ({
                                            ...draft,
                                            calculationType: event.target
                                                .value as
                                                | "FIXED"
                                                | "PERCENTAGE",
                                            amount: "",
                                            percentage: "",
                                            calculationBaseType:
                                                "BASIC_SALARY",
                                            calculationBase: "",
                                        }));

                                        setEarningDraftErrors({});
                                    }}
                                >
                                    <option value="FIXED">
                                        Fixed amount
                                    </option>
                                    <option value="PERCENTAGE">
                                        Percentage
                                    </option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="earningFrequency"
                                    className="text-xs"
                                >
                                    Frequency
                                </Label>

                                <select
                                    id="earningFrequency"
                                    className={selectClassName}
                                    value={earningDraft.frequency}
                                    onChange={(event) =>
                                        setEarningDraft((draft) => ({
                                            ...draft,
                                            frequency: event.target
                                                .value as AdditionalEarningFrequency,
                                        }))
                                    }
                                >
                                    <option value="MONTHLY">Monthly</option>
                                    <option value="ANNUAL">Annual</option>
                                    <option value="ONE_TIME">One time</option>
                                </select>
                            </div>
                        </div>

                        {earningDraft.calculationType === "FIXED" ? (
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="earningAmount"
                                    className="text-xs"
                                >
                                    Amount (₦)
                                </Label>

                                <Input
                                    id="earningAmount"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={earningDraft.amount}
                                    onChange={(event) => {
                                        setEarningDraft((draft) => ({
                                            ...draft,
                                            amount: event.target.value,
                                        }));

                                        setEarningDraftErrors((prev) => ({
                                            ...prev,
                                            amount: "",
                                        }));
                                    }}
                                    placeholder="e.g. 50000"
                                    className={inputClassName}
                                />

                                {earningDraftErrors.amount && (
                                    <p className="text-xs text-destructive">
                                        {earningDraftErrors.amount}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="calculationBaseType"
                                        className="text-xs"
                                    >
                                        Calculate percentage from
                                    </Label>

                                    <select
                                        id="calculationBaseType"
                                        className={selectClassName}
                                        value={
                                            earningDraft.calculationBaseType
                                        }
                                        onChange={(event) => {
                                            setEarningDraft((draft) => ({
                                                ...draft,
                                                calculationBaseType: event
                                                    .target
                                                    .value as CalculationBaseType,
                                                calculationBase: "",
                                            }));

                                            setEarningDraftErrors((prev) => ({
                                                ...prev,
                                                calculationBaseType: "",
                                                calculationBase: "",
                                            }));
                                        }}
                                    >
                                        {calculationBaseOptions.map(
                                            (option) => (
                                                <option
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </option>
                                            )
                                        )}
                                    </select>

                                    {earningDraftErrors.calculationBaseType && (
                                        <p className="text-xs text-destructive">
                                            {
                                                earningDraftErrors.calculationBaseType
                                            }
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="earningPercentage"
                                        className="text-xs"
                                    >
                                        Percentage (%)
                                    </Label>

                                    <Input
                                        id="earningPercentage"
                                        type="number"
                                        min="0.01"
                                        max="100"
                                        step="0.01"
                                        value={earningDraft.percentage}
                                        onChange={(event) => {
                                            setEarningDraft((draft) => ({
                                                ...draft,
                                                percentage: event.target.value,
                                            }));

                                            setEarningDraftErrors((prev) => ({
                                                ...prev,
                                                percentage: "",
                                            }));
                                        }}
                                        placeholder="e.g. 10"
                                        className={inputClassName}
                                    />

                                    {earningDraftErrors.percentage && (
                                        <p className="text-xs text-destructive">
                                            {earningDraftErrors.percentage}
                                        </p>
                                    )}
                                </div>

                                {earningDraft.calculationBaseType ===
                                    "CUSTOM_AMOUNT" && (
                                    <div className="space-y-1.5">
                                        <Label
                                            htmlFor="calculationBase"
                                            className="text-xs"
                                        >
                                            Custom calculation base (₦)
                                        </Label>

                                        <Input
                                            id="calculationBase"
                                            type="number"
                                            min="0.01"
                                            step="0.01"
                                            value={earningDraft.calculationBase}
                                            onChange={(event) => {
                                                setEarningDraft((draft) => ({
                                                    ...draft,
                                                    calculationBase:
                                                        event.target.value,
                                                }));

                                                setEarningDraftErrors(
                                                    (prev) => ({
                                                        ...prev,
                                                        calculationBase: "",
                                                    })
                                                );
                                            }}
                                            placeholder="Enter custom base amount"
                                            className={inputClassName}
                                        />

                                        {earningDraftErrors.calculationBase && (
                                            <p className="text-xs text-destructive">
                                                {
                                                    earningDraftErrors.calculationBase
                                                }
                                            </p>
                                        )}
                                    </div>
                                )}

                                {estimatedAmount !== null && (
                                    <div className="rounded-md bg-[#1078A9]/5 px-3 py-2">
                                        <p className="text-[11px] text-gray-500">
                                            Estimated{" "}
                                            {earningDraft.frequency
                                                .toLowerCase()
                                                .replace("_", " ")}{" "}
                                            earning amount
                                        </p>

                                        <p className="text-sm font-semibold text-[#1078A9]">
                                            {formatCurrency(estimatedAmount)}
                                        </p>

                                        <p className="mt-0.5 text-[10px] text-gray-500">
                                            {earningDraft.calculationBaseType ===
                                            "CUSTOM_AMOUNT"
                                                ? "Based on your custom calculation amount."
                                                : `Based on ${selectedBaseLabel ?? "the selected salary component"}.`}{" "}
                                            The server calculates the final
                                            amount.
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <DialogFooter className="flex-row justify-end gap-2 sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setEarningDialogOpen(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="button"
                            size="sm"
                            onClick={handleSaveEarning}
                            className="text-white hover:opacity-90"
                            style={{ backgroundColor: VAAD_BLUE }}
                        >
                            {editingEarningIndex !== null
                                ? "Save changes"
                                : "Add earning"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ReviewEmployeeSalaryForm;