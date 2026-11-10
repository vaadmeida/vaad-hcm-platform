import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import AddEmployeeSalaryModal from "../add-salary/AddEmployeeSalaryModal";


const EmployeeSalaryStructureToolBar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Salary Structures</h2>
          <p className="text-sm text-muted-foreground">
            Manage employee compensation and salary structures.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="h-9 gap-2 rounded-lg px-3 text-sm text-white cursor-pointer"
        >
          <PlusIcon className="h-4 w-4" />
          Add Salary
        </Button>
      </div>

      <AddEmployeeSalaryModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
};

export default EmployeeSalaryStructureToolBar;