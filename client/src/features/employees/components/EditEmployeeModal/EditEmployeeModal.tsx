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

import ButtonLoader from "@/components/common/ButtonLoader";
import type { Employee, UpdateEmployeeDTO } from "../../types/employee.types";
import PersonalInfo from "./PersonalInfo";
import EmergencyInfo from "./EmergencyInfo";
import EmploymentInfo from "./EmploymentInfo";
import PayrollAndBank from "./PayrollAndBank";
import { useState } from "react";
import { useUpdateEmployee } from "../../hooks/useUpdateEmployee";
import { toast } from "sonner";
import { useDepartments } from "@/features/departments/hooks/useDepartments";
import { useManagers } from "../../hooks/useManagers";

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

const mapEmployeeToForm = (
    employee: Employee
): UpdateEmployeeDTO => ({
    first_name: employee.personal.first_name ?? "",
    last_name: employee.personal.last_name ?? "",
    email: employee.personal.email ?? "",
    gender: employee.personal.gender ?? "",
    date_of_birth: employee.personal.date_of_birth ?? "",
    nationality: employee.personal.nationality ?? "",
    phone: employee.personal.phone ?? "",
    alternate_phone: employee.personal.alternate_phone ?? "",
    residential_address: employee.personal.residential_address ?? "",
    city: employee.personal.city ?? "",
    state_of_residence: employee.personal.state_of_residence ?? "",
    emergency_contact_name: employee.emergency_contact?.name ?? "",
    emergency_contact_relationship:
        employee.emergency_contact?.relationship ?? "",
    emergency_contact_number:
        employee.emergency_contact?.phone ?? "",

    role: employee.employment.role ?? "employee",
    job_title: employee.employment.job_title ?? "",
    job_description: employee.employment.job_description ?? "",
    department_id: employee.employment.department?.id ?? "",
    manager_id: employee.employment.manager?.id ?? "",
    work_email: employee.employment.work_email ?? "",
    status: employee.employment.status ?? "probation",
    employment_type: employee.employment.employment_type ?? "full-time",
    hire_date: employee.employment.hire_date ?? "",
    probation_end_date: employee.employment.probation_end_date ?? "",
    date_exited: employee.employment.date_exited ?? "",
    owns_personal_computer:
        employee.employment.owns_personal_computer ?? false,

    paye_id: employee.payroll?.paye_id ?? "",
    bank_name: employee.payroll?.bank_name ?? "",
    account_number: employee.payroll?.account_number ?? "",
    account_name: employee.payroll?.account_name ?? "",
});

const EmployeeEditModal = ({
    employee,
    open,
    onOpenChange,
}: EmployeeEditModalProps) => {


    const [form, setForm] = useState<UpdateEmployeeDTO>(mapEmployeeToForm(employee));
    const [activeTab, setActiveTab] = useState<"personal" | "employment" | "emergency" | "account">("personal");
    
    const { data: departments = [] } = useDepartments();

    const { data: managers = [] } = useManagers();

    const { isPending, mutateAsync } = useUpdateEmployee()
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = (name: keyof UpdateEmployeeDTO, value: string | boolean) => {
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const payload = {
        ...form,
        department_id: form.department_id || undefined,
        manager_id: form.manager_id || undefined,
    };

    const handleSubmit = async (
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        e.preventDefault();

        try {
            await mutateAsync({
                employeeId: employee.id,
                payload
            });

            onOpenChange(false);

            toast.success(`${employee.full_name}'s details updated successfully!`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update employee");
        }
    };

    const handleOpenChange = (value: boolean) => {
        if (value) {
            setForm(mapEmployeeToForm(employee));
            setActiveTab("personal");
        }

        onOpenChange(value);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="
                        flex max-h-[90vh] flex-col gap-0
                        overflow-hidden border border-gray-200
                        bg-white p-0 shadow-xl
                        sm:max-w-3xl">
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
                    value={activeTab}
                    onValueChange={(value) =>
                        setActiveTab(
                            value as "personal" | "employment" | "emergency" | "account"
                        )
                    }
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
                                       ">
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

                            <PersonalInfo handleChange={handleChange} form={form}
                            />
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

                            <EmploymentInfo form={form}
                                handleChange={handleChange} handleSelectChange={handleSelectChange}
                                departments={departments} managers={managers} />
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

                            <EmergencyInfo form={form} handleChange={handleChange} />
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
                            <PayrollAndBank form={form} handleChange={handleChange} />
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
                                onClick={handleSubmit}
                                className="
                                        rounded-md bg-[#1078A9]
                                        px-4 py-2 text-sm font-medium text-white
                                        shadow-sm transition
                                        hover:bg-[#0d668f]
                                        focus:outline-none focus:ring-2
                                        focus:ring-[#1078A9]/30
                                        "
                            >
                                {isPending ? <ButtonLoader text="Saving....." /> : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};

export default EmployeeEditModal;