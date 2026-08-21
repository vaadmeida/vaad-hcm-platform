import { useGetMyLeaveBalance } from "@/features/leaves/hooks/useGetMyLeaveBalance";
import MyLeaveHeader from "./MyLeaveHeader";
import LeaveBalanceTable from "./LeaveBalanceTable";

const MyLeave = () => {
  const {
    data,
    isPending,
    isError,
    error,
  } = useGetMyLeaveBalance();

  console.log("MY LEAVE:", {
    data,
    isPending,
    isError,
    error,
  });

  
  if (isPending) {
    return (
      <div className="p-6">
        Loading leave information...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        {error instanceof Error
          ? error.message
          : "Failed to load leave information"}
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="p-6 text-red-500">
        No leave data returned.
      </div>
    );
  }

  const { employee, balances } = data.data;

  return (
    <div className="space-y-6">
      <MyLeaveHeader
        employee={employee}
        year={balances[0]?.year}
        onRequestLeave={() => {}}
      />

      <LeaveBalanceTable
        balances={balances}
        year={balances[0]?.year}
      />
    </div>
  );
};

export default MyLeave