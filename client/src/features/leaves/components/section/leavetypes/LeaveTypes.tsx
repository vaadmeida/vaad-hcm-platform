import { useAuthStore } from "@/store/auth.store";

import CreateLeaveTypeDialog from "./CreateLeaveTypeDialog";
import LeaveTypeTable from "./LeaveTypeTable";
import LeaveTypeCard from "./LeaveTypeCard";
import { useGetLeaveTypes } from "@/features/leaves/hooks/useGetLeaveType";



const LeaveTypes = () => {
  const user = useAuthStore((state) => state.user);

  const canManageLeaveTypes =
    user?.role === "admin" || user?.role === "hr";

  const {
    data,
    isLoading,
    isError,
  } = useGetLeaveTypes();

  const leaveTypes = data?.data ?? [];

  return (
    <div>
      <div className="my-4 flex justify-end">
        {canManageLeaveTypes && <CreateLeaveTypeDialog />}
      </div>

      <section className="overflow-hidden rounded-lg lg:border lg:border-border lg:bg-white">

        {/* Desktop */}
        <div className="hidden md:block">
          <LeaveTypeTable
            leaveTypes={leaveTypes}
            isLoading={isLoading}
            isError={isError}
          />
        </div>

        {/* Mobile */}
        <div className="space-y-3 p-3 md:hidden">
          {isLoading ? (
            <div className="py-10 text-center text-sm text-gray-500">
              Loading leave types...
            </div>
          ) : isError ? (
            <div className="py-10 text-center text-sm text-red-500">
              Failed to load leave types.
            </div>
          ) : leaveTypes.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-500">
              No leave types found.
            </div>
          ) : (
            leaveTypes.map((leaveType) => (
              <LeaveTypeCard
                key={leaveType.id}
                leaveType={leaveType}
              />
            ))
          )}
        </div>

      </section>
    </div>
  );
};

export default LeaveTypes;