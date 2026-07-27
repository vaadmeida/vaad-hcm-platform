import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

type Status =
  | "active"
  | "inactive"
  | "pending"
  | "approved"
  | "rejected"
  | "probation"
  | "expired";

interface StatusBadgeProps {
  status: Status | string;
}

const statusStyles: Record<string, string> = {
  active: "bg-green-100 text-green-700 border-green-200",
  inactive: "bg-gray-100 text-gray-700 border-gray-200",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  approved: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
  probation: "bg-blue-100 text-blue-700 border-blue-200",
  expired: "bg-red-100 text-red-700 border-red-200",
};

const StatusBadge = ({status}: StatusBadgeProps) => {
  return (
    <Badge variant='outline'
        className={cn(
        "capitalize rounded-full px-2.5 py-0.5",
        statusStyles[status.toLowerCase()] ??
          "bg-gray-100 text-gray-700 border-gray-200"
      )}
>
        {status}
    </Badge>
  )
}

export default StatusBadge
