import DepartmentList from "@/features/departments/components/DepartmentList";
import DepartmentToolBar from "@/features/departments/components/DepartmentToolBar";
import { useDepartments } from "@/features/departments/hooks/useDepartments";

const DepartmentPage = () => {
    const { data: departments = [] } = useDepartments();

    return (
        <div className="min-w-0 pb-10">
            <DepartmentToolBar />
            <DepartmentList departments={departments} />
        </div>
    );
};

export default DepartmentPage;