import MyLeaveHeader from "@/features/leaves/components/section/myleave/MyLeaveHeader";
import { useGetMyLeaveBalance } from "@/features/leaves/hooks/useGetMyLeaveBalance";
import MyLeaveBalanceTable from "@/features/my-leave/MyLeaveBalanceTable";


const EmployeeLeavePage = () => {
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
        onRequestLeave={() => { }}
      />

      {/* Tablet + Desktop */}
      <div className="hidden md:block">
        <MyLeaveBalanceTable
          balances={balances}
        />
      </div>



    </div>
  );
};

export default EmployeeLeavePage