import type { PayrollPayslip } from "@/features/payslips/types/payslip.types";

import PayslipsTableRow from "./PayslipsTableRow";

type PayslipsTableProps = {
    payslips: PayrollPayslip[];
};

const PayslipsTable = ({ payslips }: PayslipsTableProps) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-160 text-sm">
                <caption className="sr-only">
                    Payslips for the selected payroll period
                </caption>

                <thead className="border-b border-gray-200/70 bg-gray-50 text-xs text-muted-foreground">
                    <tr>
                        <th scope="col" className="px-4 py-3 text-left font-medium">
                            Employee
                        </th>
                        <th scope="col" className="px-4 py-3 text-left font-medium">
                            Department
                        </th>
                        <th scope="col" className="px-4 py-3 text-right font-medium">
                            Net pay
                        </th>
                        <th scope="col" className="px-4 py-3 text-right font-medium">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-200/70">
                    {payslips.map((payslip) => (
                        <PayslipsTableRow
                            key={payslip.payslipId}
                            payslip={payslip}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PayslipsTable;