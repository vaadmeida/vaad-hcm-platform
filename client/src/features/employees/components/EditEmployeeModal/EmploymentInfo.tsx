import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Manager, UpdateEmployeeDTO } from "../../types/employee.types";
import type { Department } from "@/features/departments/types/departments.types";

interface EmploymentInfoProps {
  form: UpdateEmployeeDTO;

  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleSelectChange: ( name: keyof UpdateEmployeeDTO,value: string | boolean) => void;
  departments: Department[];
  managers: Manager[];
}

const EmploymentInfo = ({
  form,
  handleChange,
  handleSelectChange,
  departments,
  managers
}: EmploymentInfoProps) => {

  return (
    <div className="w-full min-w-0">
      <div className="grid w-full min-w-0 grid-cols-1 gap-5 sm:grid-cols-2">

        {/* Job Title */}
        <div className="min-w-0 space-y-2">
          <Label htmlFor="job_title">Job Title</Label>

          <Input
            id="job_title"
            name="job_title"
            value={form.job_title ?? ""}
            onChange={handleChange}
            placeholder="Enter job title"
            className="w-full rounded-sm border-border text-sm text-secondary placeholder:text-gray-400"
          />
        </div>

        {/* Department */}
        <div className="min-w-0 space-y-2">
          <Label htmlFor="department_id">Department</Label>

          <Select
            value={form.department_id ?? ""}
            onValueChange={(value) =>
              handleSelectChange("department_id", value)
            }
          >
            <SelectTrigger
              id="department_id"
              className="w-full rounded-sm border-border text-sm"
            >
              <SelectValue placeholder="Select department" />
            </SelectTrigger>

            <SelectContent>
              {departments.map((department) => (
                <SelectItem key={department.id} value={department.id}>
                  {department.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

        </div>

        {/* Role */}
        <div className="min-w-0 space-y-2">
          <Label htmlFor="role">Role</Label>

          <Select
            value={form.role ?? "employee"}
            onValueChange={(value) =>
              handleSelectChange("role", value)
            }
          >
            <SelectTrigger
              id="role"
              className="w-full rounded-sm border-border text-sm"
            >
              <SelectValue placeholder="Select role" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="employee">Employee</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="hr">HR</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>

          </Select>
        </div>

        {/* Employment Type */}
        <div className="min-w-0 space-y-2">
          <Label htmlFor="employment_type">Employment Type</Label>

          <Select
            value={form.employment_type ?? "full-time"}
            onValueChange={(value) =>
              handleSelectChange("employment_type", value)
            }
          >
            <SelectTrigger
              id="employment_type"
              className="w-full rounded-sm border-border text-sm"
            >
              <SelectValue placeholder="Select employment type" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="full-time">Full-time</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="intern">Intern</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="min-w-0 space-y-2">
          <Label htmlFor="status">Employment Status</Label>

          <Select
            value={form.status ?? "probation"}
            onValueChange={(value) =>
              handleSelectChange("status", value)
            }
          >
            <SelectTrigger
              id="status"
              className="w-full rounded-sm border-border text-sm"
            >
              <SelectValue placeholder="Select status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="probation">Probation</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="terminated">Terminated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Hire Date */}
        <div className="min-w-0 space-y-2">
          <Label htmlFor="hire_date">Hire Date</Label>

          <Input
            id="hire_date"
            name="hire_date"
            type="date"
           value={form.hire_date?.slice(0, 10) ?? ""}
            onChange={handleChange}
            className="w-full rounded-sm border-border text-sm text-secondary"
          />
        </div>

        {/* Probation End Date */}
        <div className="min-w-0 space-y-2">
          <Label htmlFor="probation_end_date">
            Probation End Date
          </Label>

          <Input
            id="probation_end_date"
            name="probation_end_date"
            type="date"
            value={form.probation_end_date?.slice(0, 10) ?? ""}
            onChange={handleChange}
            className="w-full rounded-sm border-border text-sm text-secondary"
          />
        </div>

        {/* Manager */}
        <div className="min-w-0 space-y-2">
          <Label htmlFor="manager_id">Manager</Label>

          <Select
            value={form.manager_id ?? ""}
            onValueChange={(value) =>
              handleSelectChange("manager_id", value)
            }
          >
            <SelectTrigger
              id="manager_id"
              className="w-full rounded-sm border-border text-sm"
            >
              <SelectValue placeholder="Select manager" />
            </SelectTrigger>

            <SelectContent>
              {managers.map((manager) => (
                <SelectItem key={manager.id} value={manager.id}>
                  {manager.first_name} {manager.last_name}
                  {manager.job_title ? ` — ${manager.job_title}` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Work Email */}
        <div className="min-w-0 space-y-2 sm:col-span-2">
          <Label htmlFor="work_email">Work Email</Label>

          <Input
            id="work_email"
            name="work_email"
            type="email"
            value={form.work_email ?? ""}
            onChange={handleChange}
            placeholder="employee@vaadhr.com"
            className="w-full rounded-sm border-border text-sm text-secondary placeholder:text-gray-400"
          />
        </div>

        {/* Owns Personal Computer */}
        <div className="min-w-0 space-y-2">
          <Label htmlFor="owns_personal_computer">
            Owns Personal Computer
          </Label>

          <Select
            value={form.owns_personal_computer ? "yes" : "no"}
            onValueChange={(value) => {
              handleSelectChange(
                "owns_personal_computer",
                value === "yes"
              );
            }}
          >
            <SelectTrigger
              id="owns_personal_computer"
              className="w-full rounded-sm border-border text-sm"
            >
              <SelectValue placeholder="Select option" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Exited */}
        <div className="min-w-0 space-y-2">
          <Label htmlFor="date_exited">Date Exited</Label>

          <Input
            id="date_exited"
            name="date_exited"
            type="date"
            value={form.date_exited?.slice(0, 10) ?? ""}
            onChange={handleChange}
            className="w-full rounded-sm border-border text-sm text-secondary"
          />
        </div>

        {/* Job Description */}
        <div className="min-w-0 space-y-2 sm:col-span-2">
          <Label htmlFor="job_description">Job Description</Label>

          <textarea
            id="job_description"
            name="job_description"
            value={form.job_description ?? ""}
            onChange={handleChange}
            placeholder="Enter job description"
            rows={4}
            className="
              w-full min-w-0 resize-none rounded-sm
              border border-border bg-background
              px-3 py-2 text-sm text-secondary
              outline-none
              placeholder:text-gray-400
              focus:border-[#1078A9]
              focus:ring-1 focus:ring-[#1078A9]
            "
          />
        </div>

      </div>
    </div>
  );
};

export default EmploymentInfo;