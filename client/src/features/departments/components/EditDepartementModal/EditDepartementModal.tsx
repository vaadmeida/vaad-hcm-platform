import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface EditDepartmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditDepartmentModal = ({
  open,
  onOpenChange,
}: EditDepartmentModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Department</DialogTitle>

          <DialogDescription>
            Update the department information below.
          </DialogDescription>
        </DialogHeader>

        {/* Department form goes here */}
      </DialogContent>
    </Dialog>
  );
};

export default EditDepartmentModal;
