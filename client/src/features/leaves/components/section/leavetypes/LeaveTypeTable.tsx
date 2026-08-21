import LeaveTypesTableRow from "./LeaveTypesTableRow";
import type { LeaveType } from "@/features/leaves/types/leave.types";


interface LeaveTypeTableProps {
    leaveTypes: LeaveType[];
    isLoading: boolean;
    isError: boolean;
}

const LeaveTypeTable = ({
    leaveTypes,
    isLoading,
    isError,
}: LeaveTypeTableProps) => {
  

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-10 text-sm text-gray-500">
                Loading leave types...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center py-10 text-sm text-red-500">
                Failed to load leave types.
            </div>
        );
    }


    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-base font-semibold text-gray-900">
                    All Leave Types ({leaveTypes.length})
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Manage the different types of leave available to employees.
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b border-gray-200 bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-sm font-medium text-gray-600">
                                Leave Type
                            </th>

                            <th className="px-6 py-4 text-sm font-medium text-gray-600">
                                Days Allowed
                            </th>

                            <th className="hidden px-6 py-4 text-sm font-medium text-gray-600 xl:table-cell">
                                Type
                            </th>

                            <th className="hidden px-6 py-4 text-sm font-medium text-gray-600  xl:table-cell">
                                Document
                            </th>

                            <th className="hidden px-6 py-4 text-sm font-medium text-gray-600 xl:table-cell">
                                Carry Over
                            </th>

                            <th className="px-6 py-4 text-sm font-medium text-gray-600">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {leaveTypes.map((leaveType) => (
                            <LeaveTypesTableRow
                                key={leaveType.id}
                                leaveType={leaveType}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {leaveTypes.length === 0 && (
                <div className="py-10 text-center text-sm text-gray-500">
                    No leave types found.
                </div>
            )}
        </div>
    );
};

export default LeaveTypeTable;