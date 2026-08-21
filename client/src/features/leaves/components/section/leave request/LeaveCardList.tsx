import type { LeaveRequest } from "@/features/leaves/types/leave.types";
import LeaveRequestCard from "./LeaveRequestCard";

interface LeaveRequestCardListProps {
  requests: LeaveRequest[];
}

const LeaveRequestCardList = ({
  requests,
}: LeaveRequestCardListProps) => {
  return (
    <div className="space-y-3 p-4">
      {requests.map((request) => (
        <LeaveRequestCard
          key={request.id}
          request={request}
        />
      ))}
    </div>
  );
};

export default LeaveRequestCardList;