import type { LeaveType } from "@/features/leaves/types/leave.types";
import EditLeaveTypeDialog from "./EditLeaveTypeDialog";
import DeleteLeaveTypeDialog from "./DeleteLeaveTypeDialog";



interface LeaveTypesTableRowProps {
    leaveType: LeaveType;
}

const LeaveTypesTableRow = ({ leaveType }: LeaveTypesTableRowProps) => {

    return (

        <>
            <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">
                        {leaveType.name}
                    </span>
                </td>

                <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">
                        {leaveType.default_days_per_year !== null
                            ? `${leaveType.default_days_per_year} days/year`
                            : "No limit"}
                    </span>
                </td>

                <td className="hidden px-6 py-4 xl:table-cell">
                    <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${leaveType.is_paid
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-700"
                            }`}
                    >
                        {leaveType.is_paid ? "Paid" : "Unpaid"}
                    </span>
                </td>

                <td className="hidden px-6 py-4  xl:table-cell">
                    <span className="text-sm text-gray-700">
                        {leaveType.requires_document ? "Required" : "Not required"}
                    </span>
                </td>

                <td className="hidden px-6 py-4  xl:table-cell">
                    <span className="text-sm text-gray-700">
                        {leaveType.carries_over
                            ? `Up to ${leaveType.max_carryover_days} days`
                            : "No"}
                    </span>
                </td>

                <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                        <EditLeaveTypeDialog
                            key={leaveType.id}
                            leaveType={leaveType}
                        />
                     
                    <DeleteLeaveTypeDialog
                        leaveType={leaveType}
                    />
                    </div>
                </td>
            </tr>



        </>

    );
};

export default LeaveTypesTableRow;