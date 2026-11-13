import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReviewEmployeeSalaryForm from "./ReviewEmployeeSalaryForm";
import type { EmployeeWithSalary } from "../../types/salary.types";

interface ReviewEmployeeSalaryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: EmployeeWithSalary;
}

const ReviewEmployeeSalaryModal = ({
  open,
  onOpenChange,
  employee,
}: ReviewEmployeeSalaryModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-137.5 bg-white">
        <DialogHeader>
          <DialogTitle>Review Employee Salary</DialogTitle>
          <DialogDescription>
            Review and update the employee's salary structure and
            compensation details.
          </DialogDescription>
        </DialogHeader>

        <ReviewEmployeeSalaryForm
          key={employee.employeeId}
          employee={employee}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ReviewEmployeeSalaryModal;
