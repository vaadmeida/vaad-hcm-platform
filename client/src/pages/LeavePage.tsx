import LeaveTabs, { type LeaveTabsTypes } from "@/features/leaves/components/LeaveTabs"
import { LeaveToolbar } from "@/features/leaves/components/LeaveToolbar"
import LeaveBalance from "@/features/leaves/components/section/LeaveBalance"
import LeaveOverview from "@/features/leaves/components/section/LeaveOverview"
import LeaveRequests from "@/features/leaves/components/section/LeaveRequests"
import LeaveTypes from "@/features/leaves/components/section/LeaveTypes"
import { useState } from "react"

const LeavePage = () => {


  const [activeTab, setActiveTab] = useState<LeaveTabsTypes>('Overview')

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
        activeTab ===  'Requests' && (
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

    </div>
  )
}

export default LeavePage
