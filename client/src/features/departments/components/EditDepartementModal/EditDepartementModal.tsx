import {
  Dialog,
  DialogContent,
  DialogDescription,

  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useManagers } from "@/features/employees/hooks/useManagers";

import { Building2 } from "lucide-react";
import { useState } from "react";
import { useUpdateDepartment } from "../../hooks/useUpdateDepartment";
import type { UpdateDepartmentDto } from "../../types/departments.types";
import { toast } from "sonner";
import { useAssignDepartmentManager } from "../../hooks/useAssignManager";
import { useRemoveDepartmentManager } from "../../hooks/useRemoveManager";

interface Department {
  id: string;
  name: string;
  description?: string | null;
  status: "active" | "inactive";
  manager_id?: string | null;
}


interface EditDepartmentModalProps {
  department: Department;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: {
    name: string;
    description: string | null;
    status: "active" | "inactive";
    manager_id: string | null;
  }) => Promise<void>;
  isPending?: boolean;
}


const mapDepartmentToForm = (department?: Department) => ({
  name: department?.name ?? "",
  description: department?.description ?? "",
  status: department?.status ?? "active",
  manager_id: department?.manager_id ?? "",
});

const EditDepartmentModal = ({
  department,
  open,
  onOpenChange,
}: EditDepartmentModalProps) => {
  const [form, setForm] = useState(() =>
    mapDepartmentToForm(department)
  );

  const { data: availableManagers = [] } = useManagers();

  const { isPending, mutateAsync } = useUpdateDepartment()

  const { mutateAsync: assignManager } = useAssignDepartmentManager();

  const { mutateAsync: removeManager } = useRemoveDepartmentManager();

  const handleChange = (e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const payload: UpdateDepartmentDto = {
    name: form.name,
    description: form.description,
    status: form.status,
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    try {
      await mutateAsync({
        departmentId: department.id,
        payload,
      });

      const originalManagerId = department.manager_id ?? "";
      const newManagerId = form.manager_id ?? "";

      console.log("MANAGER CHANGE:", {
        originalManagerId,
        newManagerId,
      });

      // Manager changed
      if (newManagerId !== originalManagerId) {
        // A manager was selected
        if (newManagerId) {
          await assignManager({
            departmentId: department.id,
            payload: {
              manager_id: newManagerId,
            },
          });
        }

        // Manager was removed
        else if (originalManagerId) {
          await removeManager({ departmentId: department.id });
        }
      }

      onOpenChange(false);

      toast.success(
        `${department.name}'s details updated successfully!`
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to update department");
    }
  };

  const handleOpenChange = (value: boolean) => {
    if (value) {
      setForm(mapDepartmentToForm(department));
    }

    onOpenChange(value);

  };


  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg border border-gray-200 bg-white p-0 shadow-xl">
        {/* Header */}
        <DialogHeader className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1078A9]/10">
              <Building2 className="h-5 w-5 text-[#1078A9]" />
            </div>

            <div>
              <DialogTitle className="text-base font-semibold text-[#121417]">
                Edit Department
              </DialogTitle>

              <DialogDescription className="mt-1 text-sm text-gray-500">
                Update the department's information, status, and manager.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-3 px-6 py-5">
            {/* Department Name */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-[#121417]"
              >
                Department Name
              </label>

              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Engineering"
                className="
                          h-10 w-full rounded-md border border-gray-300
                          bg-white px-3 text-sm text-[#121417]
                          outline-none transition
                          placeholder:text-gray-400
                          focus:border-[#1078A9]
                          focus:ring-2 focus:ring-[#1078A9]/10
                                "/>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description"
                className="text-sm font-medium text-[#121417]"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe the department's responsibilities..."
                className="w-full resize-none rounded-md border border-gray-300
                          bg-white px-3 py-2 text-sm text-secondary
                          outline-none transition
                          placeholder:text-gray-400
                          focus:border-primary
                          focus:ring-2 focus:ring-ring/10"/>
              <p className="text-xs text-gray-400">
                Maximum 500 characters.
              </p>
            </div>

            {/* Manager + Status */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Manager */}
              <div className="space-y-2">
                <label htmlFor="manager_id" className="text-sm font-medium text-secondary">
                  Department Manager
                </label>
                <select
                  id="manager_id"
                  name="manager_id"
                  value={form.manager_id}
                  onChange={handleChange}
                  className="
                          h-10 w-full rounded-md border border-gray-300
                          bg-white px-3 text-sm text-secondary
                          outline-none transition
                          focus:border-primary
                          focus:ring-2 focus:ring-ring/10">
                  <option value="">No Manager</option>
                  {(availableManagers).map((manager) => (
                    <option key={manager.id} value={manager.id}>
                      {manager.first_name} {manager.last_name}
                    </option>
                  ))}
                </select>

                <p className="text-xs text-gray-400">
                  Assign a manager responsible for this department.
                </p>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label htmlFor="status"
                  className="text-sm font-medium text-secondary"
                >
                  Status
                </label>

                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="
                            h-10 w-full rounded-md border border-gray-300
                            bg-white px-3 text-sm text-secondary
                            outline-none transition
                            focus:border-primary
                            focus:ring-2 focus:ring-ring/10
                                    ">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex shrink-0 items-center justify-between border-t border-gray-200 px-6 py-4">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-md border border-gray-300 bg-white
                        px-4 py-2 text-sm font-medium text-gray-700
                        transition hover:bg-gray-50">  Cancel</button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-md bg-primary
                        px-4 py-2 text-sm font-medium text-white
                        shadow-sm transition
                        hover:bg-primary-hover
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                        ">
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDepartmentModal;