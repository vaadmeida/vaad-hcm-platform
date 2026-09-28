import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

import {
    BriefcaseBusiness,
    CircleDollarSign,
    Gift,
} from "lucide-react";

import ButtonLoader from "@/components/common/ButtonLoader";
import { toast } from "sonner";
import type { CreateEmployeeSalaryDTO } from "../../types/salary.types";
import { useCreateEmployeeSalary } from "../../hooks/useCreateEmployeeSalary";
import SalaryDetailsForm from "./SalaryDetailsForm";
import SalaryComponentsForm from "./SalaryComponentsForm";
import AdditionalEarningsForm from "./AdditionalEarnings";
import { tabTriggerClass } from "@/lib/styles";


interface CreateSalaryModalProps {
    employeeId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type SalaryTab = "details" | "components" | "earnings";



const initialForm: CreateEmployeeSalaryDTO = {
    annualBaseSalary: 0,
    effectiveDate: "",
    monthlyGross: 0,
    paye: 0,
    netPay: 0,
    components: [],
    additionalEarnings: [],
};

const CreateSalaryModal = ({
    employeeId,
    open,
    onOpenChange,
}: CreateSalaryModalProps) => {
    const [form, setForm] =
        useState<CreateEmployeeSalaryDTO>(initialForm);

    const [activeTab, setActiveTab] =
        useState<SalaryTab>("details");

    const { mutateAsync, isPending } = useCreateEmployeeSalary();

    const handleOpenChange = (value: boolean) => {
        if (value) {
            setForm(initialForm);
            setActiveTab("details");
        }

        onOpenChange(value);
    };

    const handleSubmit = async () => {
        if (form.components.length === 0) {
            toast.error("Add at least one salary component.");
            setActiveTab("components");
            return;
        }

        const totalPercentage = form.components.reduce(
            (total, component) => total + component.percentage,
            0
        );

        if (totalPercentage !== 100) {
            toast.error(
                `Salary component percentages must total 100%. Current total: ${totalPercentage}%.`
            );
            setActiveTab("components");
            return;
        }

        try {
            await mutateAsync({
                employeeId,
                payload: form,
            });

            toast.success("Salary structure created successfully.");
            onOpenChange(false);
        } catch (error) {
            console.error("Create salary error:", error);
            toast.error("Failed to create salary structure.");
        }
    };
    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="
          flex max-h-[90vh] flex-col gap-0
          overflow-hidden border border-gray-200
          bg-white p-0 shadow-xl
          sm:max-w-3xl
        "
            >
                {/* Header */}
                <DialogHeader className="border-b border-gray-200 px-4 py-5 sm:px-6">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1078A9]/10">
                            <CircleDollarSign className="h-5 w-5 text-[#1078A9]" />
                        </div>

                        <div className="min-w-0">
                            <DialogTitle className="text-base font-semibold text-[#121417]">
                                Add Salary Structure
                            </DialogTitle>

                            <DialogDescription className="mt-1 text-sm text-gray-500">
                                Set up the employee&apos;s salary, components, and
                                additional earnings.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Tabs */}
                <Tabs
                    value={activeTab}
                    onValueChange={(value) =>
                        setActiveTab(value as SalaryTab)
                    }
                    className="flex min-h-0 flex-1 flex-col"
                >
                    {/* Tab Navigation */}
                    <div className="border-b border-gray-200 px-4 sm:px-6">
                        <TabsList
                            className="
                grid h-auto w-full grid-cols-3
                rounded-none bg-transparent p-0
                sm:flex sm:justify-start sm:gap-7
              "
                        >
                            <TabsTrigger
                                value="details"
                                className={tabTriggerClass}
                            >
                                <CircleDollarSign className="h-4 w-4 shrink-0" />
                                Salary Details
                            </TabsTrigger>

                            <TabsTrigger
                                value="components"
                                className={tabTriggerClass}
                            >
                                <BriefcaseBusiness className="h-4 w-4 shrink-0" />
                                Components
                            </TabsTrigger>

                            <TabsTrigger
                                value="earnings"
                                className={tabTriggerClass}
                            >
                                <Gift className="h-4 w-4 shrink-0" />
                                Additional Earnings
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Scrollable Content */}
                    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                        {/* Salary Details */}
                        <TabsContent
                            value="details"
                            className="mt-0 w-full outline-none"
                        >
                            <div className="mb-5">
                                <h3 className="text-sm font-semibold text-[#121417]">
                                    Salary Details
                                </h3>

                                <p className="mt-1 text-xs text-gray-500">
                                    Enter the employee&apos;s main salary information.
                                </p>
                            </div>

                            <SalaryDetailsForm
                                form={form}
                                setForm={setForm}
                            />
                        </TabsContent>

                        {/* Components */}
                        <TabsContent
                            value="components"
                            className="mt-0 w-full outline-none"
                        >
                            <SalaryComponentsForm
                                form={form}
                                setForm={setForm}
                            />

                        </TabsContent>

                        {/* Additional Earnings */}
                        <TabsContent value="earnings"
                            className="mt-0 w-full outline-none"
                        >
                            <AdditionalEarningsForm
                                form={form}
                                setForm={setForm}
                            />

                        </TabsContent>
                    </div>

                    {/* Footer */}
                    <div
                        className="
              flex shrink-0 items-center justify-between
              border-t border-gray-200 bg-gray-50/70
              px-4 py-4 sm:px-6
            "
                    >
                        <p className="hidden text-xs text-gray-500 sm:block">
                            Salary information will be added to this employee&apos;s
                            record.
                        </p>

                        <div className="ml-auto flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => onOpenChange(false)}
                                className="
                  rounded-md border border-gray-300 bg-white
                  px-4 py-2 text-sm font-medium text-gray-700
                  transition hover:bg-gray-50
                "
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isPending}
                                className="
                                        rounded-md bg-[#1078A9]
                                        px-4 py-2 text-sm font-medium text-white
                                        shadow-sm transition
                                        hover:bg-[#0d668f]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-60
                                        focus:outline-none
                                        focus:ring-2 focus:ring-[#1078A9]/30">
                               {isPending ? (
                                    <ButtonLoader text="Creating..." />
                                ) : (
                                    "Create Salary"
                                )}
                            </button>
                        </div>
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};


export default CreateSalaryModal