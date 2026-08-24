import LeaveTabs, { type LeaveTabsTypes } from "@/features/leaves/components/LeaveTabs"
import { LeaveToolbar } from "@/features/leaves/components/LeaveToolbar"
import LeaveBalance from "@/features/leaves/components/section/leavebalance/LeaveBalance"
import LeaveOverview from "@/features/leaves/components/section/overview/LeaveOverview"
import LeaveRequests from "@/features/leaves/components/section/leave request/LeaveRequests"
import LeaveTypes from "@/features/leaves/components/section/leavetypes/LeaveTypes"
import { useState } from "react"
import MyLeave from "@/features/leaves/components/section/myleave/MyLeave"
import { useAuthStore } from "@/store/auth.store"


const LeavePage = () => {


  const [activeTab, setActiveTab] = useState<LeaveTabsTypes>('Overview')

  const user = useAuthStore((state) => state.user)


  return (
    <div className="space-y-6">
      <LeaveToolbar />

      <LeaveTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {
        activeTab === 'Overview' && (
          <LeaveOverview />
        )
      }
      {
        activeTab === 'Requests' && (
          <LeaveRequests />
        )
      }
      {
        activeTab === 'Balances' && (
          <LeaveBalance />
        )
      }
      {
        activeTab === 'Leave Types' && (
          <LeaveTypes />
        )
      }
      
      { 
        activeTab === 'My Leaves' && user?.role !== 'admin' && (
          <MyLeave />
        )}

    </div>
  )
}

export default LeavePage
