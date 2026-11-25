import type { PayrollTabsTypes } from "@/features/payroll/components/PayrollTabs"
import PayrollTabs from "@/features/payroll/components/PayrollTabs"
import { PayrollToolbar } from "@/features/payroll/components/PayrollToolbar"
import MonthlyPayroll from "@/features/payroll/components/sections/monthly-payroll/MonthlyPayroll"
import PayrollOverview from "@/features/payroll/components/sections/overview/PayrollOverview"
import Payslips from "@/features/payroll/components/sections/payslips/Payslips"
import EmployeeSalaryStructure from "@/features/salary/components/employeeSalary/EmployeeSalaryStructure"
import { useState } from "react"

const PayrollPage = () => {


    const [activeTab, setActiveTab] = useState<PayrollTabsTypes>('Overview')

    const [payslipPeriod, setPayslipPeriod] = useState<{
        year: number;
        month: number;
    } | null>(null);

    const handleViewPayslips = (year: number, month: number) => {
        setPayslipPeriod({ year, month });
        setActiveTab("Payslips");
    };

    return (
        <div className="space-y-6">
            <PayrollToolbar />
            <PayrollTabs activeTab={activeTab} onTabChange={setActiveTab} />
            {
                activeTab === 'Overview' && (
                    <PayrollOverview />
                )
            }
            {
                activeTab === 'Salary Structures' && (
                    <EmployeeSalaryStructure />
                )
            }
            {
                activeTab === 'Monthly Payroll' && (
                    <MonthlyPayroll onViewPayslips={handleViewPayslips} />
                )
            }
            {
                activeTab === 'Payslips' && (
                    <Payslips
                        initialYear={payslipPeriod?.year ?? null}
                        initialMonth={payslipPeriod?.month ?? null}
                    />
                )
            }

        </div>
    )
}

export default PayrollPage
