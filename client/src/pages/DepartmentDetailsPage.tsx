import DepartmentDetailsTab, { type DepartmentDetailsTab as DepartmentDetailsTabType } from "@/features/departments/components/DepartmentsDetails/DepartmentDetailsTab";
import DepartmentsDetailsHeader from "@/features/departments/components/DepartmentsDetails/DepartmentsDetailsHeader";
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
             onTabChange={setActiveTab}/>
        </div>
    )
}

export default DepartmentDetailsPage
