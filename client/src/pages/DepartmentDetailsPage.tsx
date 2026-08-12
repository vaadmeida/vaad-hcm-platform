import DepartmentRecentActivity from "@/features/departments/components/DepartmentRecentActivity";
import DepartmentDetailsTab, { type DepartmentDetailsTab as DepartmentDetailsTabType } from "@/features/departments/components/DepartmentsDetails/DepartmentDetailsTab";
import DepartmentsDetailsHeader from "@/features/departments/components/DepartmentsDetails/DepartmentsDetailsHeader";
import DepartmentStatistics from "@/features/departments/components/DepartmentStatistics";
import DepartmentTeamMembers from "@/features/departments/components/DepartmentTeamMembers.";
import EditDepartementModal from "@/features/departments/components/EditDepartementModal/EditDepartementModal";
import { useDepartmentsDetails } from "@/features/departments/hooks/useDepartmentsDetails";
import { useState } from "react";
import { useParams } from "react-router-dom";

const DepartmentDetailsPage = () => {


    const [open, setOpen] = useState(false)
    const { departmentId } = useParams();

    const [activeTab, setActiveTab] =
        useState<DepartmentDetailsTabType>("team members");

    const { data: department, isPending } = useDepartmentsDetails(departmentId);

    if (isPending) {
        return <div>Loading...</div>;
    }
    if (!department) {
        return <div>Departments not Found</div>;
    }

    return (
        <div className="space-y-6">
            <DepartmentsDetailsHeader
                department={department}
                onEdit={() => setOpen(true)}
            />

            <EditDepartementModal
                open={open}
                onOpenChange={setOpen}
                department={department}
            />


            <DepartmentDetailsTab
                activeTab={activeTab}
                onTabChange={setActiveTab} />

            {
                activeTab === 'team members' && (
                    <DepartmentTeamMembers departmentId={department.id} />
                )
            }
            {
                activeTab === 'recent activity' && (
                    <DepartmentRecentActivity
                      departmentId={department.id} />
                )
            }
            {
                activeTab === 'statistics' && (
                    <DepartmentStatistics department={department} departmentId={department.id}/>
                )
            }


        </div>
    )
}

export default DepartmentDetailsPage
