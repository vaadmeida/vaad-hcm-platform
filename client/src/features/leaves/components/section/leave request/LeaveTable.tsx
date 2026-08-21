import LeaveRequestTableRow from "@/assets/section/leave request/LeaveTableRow";
import type { LeaveRequest } from "@/features/leaves/types/leave.types";



interface LeaveRequestTableProps {
  requests: LeaveRequest[];
}

const LeaveRequestTable = ({
  requests,
}: LeaveRequestTableProps) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-y border-border bg-muted/10 text-left text-xs font-medium text-muted-foreground">
            
            <th className="px-4 py-3 pr-2">
              Employee
            </th>

            <th className="px-4 py-3 ">
              Leave Type
            </th>


            <th className="hidden px-4 py-3 xl:table-cell">
              Start – End
            </th>

            <th className=" hidden px-4 py-3 xl:table-cell">
              Status
            </th>

            <th className="px-4 py-3 text-right">
              Actions
            </th>

          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {requests.map((request) => (
            <LeaveRequestTableRow
              key={request.id}
              request={request}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveRequestTable;