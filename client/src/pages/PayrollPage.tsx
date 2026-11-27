import { useState } from "react";

import PayrollTabs, {
    type PayrollTabsTypes,
} from "@/features/payroll/components/PayrollTabs";
import { PayrollToolbar } from "@/features/payroll/components/PayrollToolbar";
import MonthlyPayroll from "@/features/payroll/components/sections/monthly-payroll/MonthlyPayroll";
import PayrollOverview from "@/features/payroll/components/sections/overview/PayrollOverview";
import Payslips from "@/features/payroll/components/sections/payslips/Payslips";
import EmployeeSalaryStructure from "@/features/salary/components/employeeSalary/EmployeeSalaryStructure";

const PayrollPage = () => {
    const [activeTab, setActiveTab] = useState<PayrollTabsTypes>("Overview");
    const [overviewPayrollId, setOverviewPayrollId] = useState<string | null>(null);
    const [payslipPeriod, setPayslipPeriod] = useState<{
        year: number;
        month: number;
    } | null>(null);

    const handleTabChange = (tab: PayrollTabsTypes) => {
        if (tab !== activeTab) {
            setOverviewPayrollId(null);
        }

        setActiveTab(tab);
    };

    const handleOpenPayroll = (payrollId: string) => {
        setOverviewPayrollId(payrollId);
        setActiveTab("Monthly Payroll");
    };

    const handleViewAllPayrolls = () => {
        setOverviewPayrollId(null);
        setActiveTab("Monthly Payroll");
    };

    const handleViewPayslips = (year: number, month: number) => {
        setPayslipPeriod({ year, month });
        setActiveTab("Payslips");
    };

    return (
        <div className="space-y-6">
            <PayrollToolbar />
            <PayrollTabs activeTab={activeTab} onTabChange={handleTabChange} />

            {activeTab === "Overview" && (
                <PayrollOverview
                    onOpenPayroll={handleOpenPayroll}
                    onViewAllPayrolls={handleViewAllPayrolls}
                />
            )}

            {activeTab === "Salary Structures" && <EmployeeSalaryStructure />}

            {activeTab === "Monthly Payroll" && (
                <MonthlyPayroll
                    initialPayrollId={overviewPayrollId}
                    onViewPayslips={handleViewPayslips}
                />
            )}

            {activeTab === "Payslips" && (
                <Payslips
                    initialYear={payslipPeriod?.year ?? null}
                    initialMonth={payslipPeriod?.month ?? null}
                />
            )}
        </div>
    );
};

export default PayrollPage;