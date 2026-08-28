import { useState } from "react";
import EmployeeDetailsHeader from "@/features/employees/components/EmployeeDetailsHeader";
import { useGetMyProfile } from "@/features/my-profile/hooks/useGetMyProfile";
import EmployeeEditModal from "@/features/employees/components/EditEmployeeModal/EditEmployeeModal";
import EmployeeDetailsTabs, { type EmployeeDetailsTab } from "@/features/employees/components/EmployeeDetailsTab/EmployeeDetailsTabs";
import EmployeeOverview from "@/features/employees/components/EmployeeDetailsTab/EmployeeOverview";

const MyProfile = () => {

    const [open, setOpen] = useState(false);

    const { data: employee, isLoading, isError } = useGetMyProfile();

    const [activeTab, setActiveTab] = useState<EmployeeDetailsTab>("overview");

    if (isLoading) {
        return <div>Loading profile...</div>;
    }

    if (isError || !employee) {
        return <div>Failed to load profile.</div>;
    }

    return (
        <div className="space-y-6">
            <EmployeeDetailsHeader
                employee={employee}
                onEdit={() => setOpen(true)}
                isMyProfile
            />

            <EmployeeDetailsTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />


            {activeTab === "overview" && (
                <EmployeeOverview employee={employee} />
            )}


            {/* Edit Employee Modal */}
            <EmployeeEditModal
                key={employee.id}
                employee={employee}
                open={open}
                onOpenChange={setOpen}
                isMyProfile
            />
        </div>
    );
};

export default MyProfile;