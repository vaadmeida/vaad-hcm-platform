import type { PayrollTabsTypes } from "@/features/payroll/components/PayrollTabs"
import PayrollTabs from "@/features/payroll/components/PayrollTabs"
import { PayrollToolbar } from "@/features/payroll/components/PayrollToolbar"
import PayrollOverview from "@/features/payroll/components/sections/overview/PayrollOverview"
import EmployeeSalaryStructure from "@/features/salary/components/employeeSalary/EmployeeSalaryStructure"
import { useState } from "react"

const PayrollPage = () => {


    const [activeTab, setActiveTab] = useState<PayrollTabsTypes>('Overview')

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

        </div>
    )
}

export default PayrollPage
