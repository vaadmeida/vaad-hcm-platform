import LeaveRequestsByType from "../LeaveRequestsByType"
import LeaveStats from "../LeaveStats"

const LeaveOverview = () => {
  return (
    <div>
       <LeaveStats/>
       <LeaveRequestsByType/>
    </div>
  )
}

export default LeaveOverview
