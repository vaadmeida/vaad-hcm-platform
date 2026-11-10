import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddEmployeeSalaryForm from "./AddEmployeeSalaryForm";

interface AddEmployeeSalaryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddEmployeeSalaryModal = ({
  open,
  onOpenChange,
}: AddEmployeeSalaryModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-137.5 bg-white">
        <DialogHeader>
          <DialogTitle>Add Employee Salary</DialogTitle>
          <DialogDescription>
            Set up an employee's salary structure and compensation details.
          </DialogDescription>
        </DialogHeader>

        <AddEmployeeSalaryForm
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeSalaryModal;