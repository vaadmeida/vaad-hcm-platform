import CurrentlyOnLeaves from "./CurrentlyOnLeaves"
import RecentLeavesRequest from "./RecentLeavesRequest"


const LeaveRequestsByType = () => {
    return (
        <div className="grid items-start gap-6 lg:grid-cols-2 mt-8">
            <CurrentlyOnLeaves/>
            <RecentLeavesRequest />
        </div>
    )
}

export default LeaveRequestsByType
