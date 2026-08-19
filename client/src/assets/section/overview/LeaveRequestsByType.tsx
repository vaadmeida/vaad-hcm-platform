import RecentLeavesRequest from "./RecentLeavesRequest"
import UpcomingApprovedLeaves from "./UpcomingApprovedLeaves"

const LeaveRequestsByType = () => {
    return (
        <div className="grid items-start gap-6 lg:grid-cols-2 mt-8">
            <UpcomingApprovedLeaves />
            <RecentLeavesRequest />
        </div>
    )
}

export default LeaveRequestsByType
