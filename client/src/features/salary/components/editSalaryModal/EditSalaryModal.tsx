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

import type {
  CreateEmployeeSalaryDTO,
  EmployeeSalary,
} from "../../types/salary.types";

import { useUpdateEmployeeSalary } from "../../hooks/useUpdateEmployeeSalary";

import SalaryDetailsForm from "../createSalaryModal/SalaryDetailsForm";
import SalaryComponentsForm from "../createSalaryModal/SalaryComponentsForm";
import AdditionalEarningsForm from "../createSalaryModal/AdditionalEarnings";
import { tabTriggerClass } from "@/lib/styles";

interface EditSalaryModalProps {
  employeeId: string;
  salary: EmployeeSalary;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SalaryTab = "details" | "components" | "earnings";


const EditSalaryModal = ({
  employeeId,
  salary,
  open,
  onOpenChange,
}: EditSalaryModalProps) => {
  const [form, setForm] = useState<CreateEmployeeSalaryDTO>(
    getInitialForm(salary)
  );

  const [activeTab, setActiveTab] =
    useState<SalaryTab>("details");

  const { mutateAsync, isPending } =
    useUpdateEmployeeSalary();

  const getSalaryForm = (): CreateEmployeeSalaryDTO => {
    return {
      annualBaseSalary: salary.annualBaseSalary,
      effectiveDate: salary.effectiveDate,
      monthlyGross: salary.monthlyGross,
      paye: salary.paye,
      netPay: salary.netPay,

      components: salary.components.map((component) => ({
        name: component.name,
        percentage: component.percentage,
        annualAmount: component.annualAmount,
      })),

      additionalEarnings: salary.additionalEarnings.map(
        (earning) => ({
          name: earning.name,
          amount: earning.amount,
          frequency: earning.frequency,
        })
      ),
    };
  };

  const handleOpenChange = (value: boolean) => {
    if (value) {
      setForm(getSalaryForm());
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
  (total, component) => total + Number(component.percentage),
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

      toast.success(
        "Salary structure updated successfully."
      );

      onOpenChange(false);
    } catch (error) {
      console.error("Update salary error:", error);

      toast.error(
        "Failed to update salary structure."
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogContent
        className="
          flex max-h-[90vh] flex-col gap-0
          overflow-hidden border border-gray-200
          bg-white p-0 shadow-xl
          sm:max-w-3xl
        "
      >
        <DialogHeader className="border-b border-gray-200 px-4 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1078A9]/10">
              <CircleDollarSign className="h-5 w-5 text-[#1078A9]" />
            </div>

            <div className="min-w-0">
              <DialogTitle className="text-base font-semibold text-[#121417]">
                Edit Salary Structure
              </DialogTitle>

              <DialogDescription className="mt-1 text-sm text-gray-500">
                Update the employee&apos;s salary,
                components, and additional earnings.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as SalaryTab)
          }
          className="flex min-h-0 flex-1 flex-col"
        >
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

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            <TabsContent
              value="details"
              className="mt-0 w-full outline-none"
            >
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-[#121417]">
                  Salary Details
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Update the employee&apos;s main salary
                  information.
                </p>
              </div>

              <SalaryDetailsForm
                form={form}
                setForm={setForm}
              />
            </TabsContent>

            <TabsContent
              value="components"
              className="mt-0 w-full outline-none"
            >
              <SalaryComponentsForm
                form={form}
                setForm={setForm}
              />
            </TabsContent>

            <TabsContent
              value="earnings"
              className="mt-0 w-full outline-none"
            >
              <AdditionalEarningsForm
                form={form}
                setForm={setForm}
              />
            </TabsContent>
          </div>

          <div
            className="
              flex shrink-0 items-center justify-between
              border-t border-gray-200 bg-gray-50/70
              px-4 py-4 sm:px-6
            "
          >
            <p className="hidden text-xs text-gray-500 sm:block">
              Changes will update this employee&apos;s
              current salary structure.
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
                  focus:ring-2 focus:ring-[#1078A9]/30
                "
              >
                {isPending ? (
                  <ButtonLoader text="Updating..." />
                ) : (
                  "Update Salary"
                )}
              </button>
            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};


const getInitialForm = (
  salary: EmployeeSalary
): CreateEmployeeSalaryDTO => {
  return {
    annualBaseSalary: Number(salary.annualBaseSalary),
    effectiveDate: salary.effectiveDate.slice(0, 10),
    monthlyGross: Number(salary.monthlyGross),
    paye: Number(salary.paye),
    netPay: Number(salary.netPay),

    components: salary.components.map((component) => ({
      name: component.name,
      percentage: Number(component.percentage),
      annualAmount: Number(component.annualAmount),
    })),

    additionalEarnings: salary.additionalEarnings.map((earning) => ({
      name: earning.name,
      amount: Number(earning.amount),
      frequency: earning.frequency,
    })),
  };
};

export default EditSalaryModal;