import { Badge } from "@/components/ui/badge";
import type { PayrollStatus } from "@/features/payroll/types/payroll.types";


const statusStyles: Record<PayrollStatus, string> = {
    DRAFT: "bg-gray-100 text-gray-700 hover:bg-gray-100",
    CALCULATED: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    REVIEWED: "bg-amber-100 text-amber-700 hover:bg-amber-100",
    APPROVED: "bg-purple-100 text-purple-700 hover:bg-purple-100",
    PROCESSED: "bg-green-100 text-green-700 hover:bg-green-100",
};

const PayrollStatusBadge = ({ status }: { status: PayrollStatus }) => {
    return (
        <Badge
            variant="secondary"
            className={statusStyles[status]}
        >
            {status.charAt(0) + status.slice(1).toLowerCase()}
        </Badge>
    );
};

export default PayrollStatusBadge;
