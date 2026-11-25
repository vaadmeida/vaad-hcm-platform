import { Download, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useDownloadPayslip } from "@/features/payslips/hooks/useDownloadPayslip";
import type { PayrollPayslip } from "@/features/payslips/types/payslip.types";

type PayslipsTableRowProps = {
    payslip: PayrollPayslip;
};

const currency = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
});

const PayslipsTableRow = ({ payslip }: PayslipsTableRowProps) => {
    const { mutate, isPending } = useDownloadPayslip();
    const Icon = isPending ? LoaderCircle : Download;

    return (
        <tr className="hover:bg-gray-50/70">
            <th scope="row" className="px-4 py-3 text-left font-normal">
                <div className="font-medium text-foreground">
                    {payslip.employeeName}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                    {payslip.employeeNumber ?? "—"}
                </div>
            </th>

            <td className="px-4 py-3 text-muted-foreground">
                {payslip.departmentNames.join(", ") || "—"}
            </td>

            <td className="whitespace-nowrap px-4 py-3 text-right font-medium tabular-nums">
                {currency.format(Number(payslip.netPay))}
            </td>

            <td className="px-4 py-3 text-right">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="whitespace-nowrap border-gray-200/70 shadow-none cursor-pointer hover:bg-gray-200"
                    disabled={isPending}
                    aria-busy={isPending}
                    aria-label={`Download PDF for ${payslip.employeeName}`}
                    onClick={() => mutate(payslip.payslipId)}
                >
                    <Icon
                        aria-hidden="true"
                        className={isPending ? "size-4 motion-safe:animate-spin" : "size-4"}
                    />
                    {isPending ? "Preparing…" : "Download PDF"}
                </Button>
            </td>
        </tr>
    );
};

export default PayslipsTableRow;