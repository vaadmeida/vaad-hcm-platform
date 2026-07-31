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
    CreditCard,
    ShieldCheck,
    UserRound,
} from "lucide-react";

import type { Employee } from "../../types/employee.types";
import PersonalInfo from "./PersoanlInfo";
import EmergencyInfo from "./EmergencyInfo";
import EmploymentInfo from "./EmploymentInfo";
import PayrollAndBank from "./PayrollAndBank";

interface EmployeeEditModalProps {
    employee: Employee;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const tabTriggerClass = `
  relative flex h-11 items-center justify-center gap-2
  rounded-none border-0 bg-transparent
  px-2 text-xs font-medium text-gray-500
  shadow-none
  hover:text-[#1078A9]
  data-[state=active]:bg-transparent
  data-[state=active]:text-[#1078A9]
  data-[state=active]:shadow-none
  after:absolute after:bottom-0 after:left-0 after:right-0
  after:h-0.5 after:bg-transparent
  data-[state=active]:after:bg-[#1078A9]
  sm:h-12 sm:w-auto sm:justify-start sm:px-0 sm:text-sm
`;

const EmployeeEditModal = ({
    employee,
    open,
    onOpenChange,
}: EmployeeEditModalProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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
                            <UserRound className="h-5 w-5 text-[#1078A9]" />
                        </div>

                        <div className="min-w-0">
                            <DialogTitle className="text-base font-semibold text-[#121417]">
                                Edit Employee
                            </DialogTitle>

                            <DialogDescription className="mt-1 text-sm text-gray-500">
                                Update {employee.full_name} information and account details.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Content */}
                <Tabs
                    defaultValue="personal"
                    className="flex min-h-0 flex-1 flex-col"
                >
                    {/* Tab Navigation */}
                    <div className="border-b border-gray-200 px-4 sm:px-6">
                        <TabsList
                            className="
                grid h-auto w-full grid-cols-2
                rounded-none bg-transparent p-0
                sm:flex sm:grid-cols-none sm:justify-start sm:gap-7
              "
                        >
                            <TabsTrigger value="personal" className={tabTriggerClass}>
                                <UserRound className="h-4 w-4 shrink-0" />
                                Personal
                            </TabsTrigger>

                            <TabsTrigger value="employment" className={tabTriggerClass}>
                                <BriefcaseBusiness className="h-4 w-4 shrink-0" />
                                Employment
                            </TabsTrigger>

                            <TabsTrigger value="emergency" className={tabTriggerClass}>
                                <ShieldCheck className="h-4 w-4 shrink-0" />
                                Emergency
                            </TabsTrigger>

                            <TabsTrigger value="account" className={tabTriggerClass}>
                                <CreditCard className="h-4 w-4 shrink-0" />
                                Payroll
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Scrollable Form Area */}
                    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                        {/* Personal */}
                        <TabsContent value="personal" className="mt-0 w-full outline-none">
                            <div className="mb-5">
                                <h3 className="text-sm font-semibold text-[#121417]">
                                    Personal Information
                                </h3>

                                <p className="mt-1 text-xs text-gray-500">
                                    Update the employee's basic personal information.
                                </p>
                            </div>

                            <PersonalInfo employee={employee} />
                        </TabsContent>

                        {/* Employment */}
                        <TabsContent
                            value="employment"
                            className="mt-0 w-full min-w-0 outline-none"
                        >
                            <div className="mb-5">
                                <h3 className="text-sm font-semibold text-[#121417]">
                                    Employment Information
                                </h3>

                                <p className="mt-1 text-xs text-gray-500">
                                    Manage the employee's role, department, and employment status.
                                </p>
                            </div>

                            <EmploymentInfo employee={employee} />
                        </TabsContent>

                        {/* Emergency */}
                        <TabsContent
                            value="emergency"
                            className="mt-0 w-full min-w-0 outline-none"
                        >
                            <div className="mb-5">
                                <h3 className="text-sm font-semibold text-secondary">
                                    Emergency Contact
                                </h3>

                                <p className="mt-1 text-xs text-gray-500">
                                    Maintain the employee's emergency contact information.
                                </p>
                            </div>

                            <EmergencyInfo employee={employee} />
                        </TabsContent>

                        {/* Payroll */}
                        <TabsContent value="account" className="mt-0 w-full min-w-0 outline-none">
                            <div className="mb-5">
                                <h3 className="text-sm font-semibold text-secondary">
                                    Payroll & Bank Details
                                </h3>

                                <p className="mt-1 text-xs text-gray-500">
                                    Manage payroll identification and employee banking details.
                                </p>
                            </div>
                            <PayrollAndBank employee={employee} />
                        </TabsContent>
                    </div>

                    {/* Footer */}
                    <div className="flex shrink-0 items-center justify-between border-t border-gray-200 bg-gray-50/70 px-4 py-4 sm:px-6">
                        <p className="hidden text-xs text-gray-500 sm:block">
                            Changes will be applied to this employee's record.
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
                                className="
                                        rounded-md bg-[#1078A9]
                                        px-4 py-2 text-sm font-medium text-white
                                        shadow-sm transition
                                        hover:bg-[#0d668f]
                                        focus:outline-none focus:ring-2
                                        focus:ring-[#1078A9]/30
                                        "
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};

export default EmployeeEditModal;