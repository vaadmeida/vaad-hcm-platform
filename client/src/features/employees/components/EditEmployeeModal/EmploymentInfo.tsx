import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Employee } from "../../types/employee.types";

interface EmploymentInfoProps {
  employee: Employee;
}

const EmploymentInfo = ({ employee }: EmploymentInfoProps) => {
  const { employment } = employee;

  return (
    <div className="w-full min-w-0">
      <div className="grid w-full min-w-0 grid-cols-1 gap-5 sm:grid-cols-2">

        {/* Job Title */}
        <div className="min-w-0 space-y-2">
          <Label htmlFor="job_title">Job Title</Label>

          <Input
            id="job_title"
            defaultValue={employment.job_title ?? ""}
            placeholder="Enter job title"
            className="w-full rounded-sm border-border text-sm text-secondary placeholder:text-gray-400"
          />
        </div>

        {/* Department */}
        <div className="min-w-0 space-y-2">
          <Label htmlFor="department">Department</Label>

          <Select defaultValue={employment.department?.id ?? ""}>
            <SelectTrigger
              id="department"
              className="w-full rounded-sm border-border text-sm"
            >
              <SelectValue placeholder="Select department" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="research">
                Research & Innovation
              </SelectItem>

              <SelectItem value="technology">
                Technology
              </SelectItem>

              <SelectItem value="marketing">
                Marketing
              </SelectItem>

              <SelectItem value="human-resources">
                Human Resources
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Role */}
        <div className="min-w-0 space-y-2">
          <Label htmlFor="role">Role</Label>

          <Select defaultValue={employment.role ?? ""}>
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

          <Select defaultValue={employment.employment_type ?? ""}>
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
              <SelectItem value="internship">Internship</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="min-w-0 space-y-2">
          <Label htmlFor="status">Employment Status</Label>

          <Select defaultValue={employment.status ?? ""}>
            <SelectTrigger
              id="status"
              className="w-full rounded-sm border-border text-sm"
            >
              <SelectValue placeholder="Select status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="probation">Probation</SelectItem>
              <SelectItem value="on_leave">On Leave</SelectItem>
              <SelectItem value="terminated">Terminated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Hire Date */}
        <div className="min-w-0 space-y-2">
          <Label htmlFor="hire_date">Hire Date</Label>

          <Input
            id="hire_date"
            type="date"
            defaultValue={
              employment.hire_date
                ? employment.hire_date.slice(0, 10)
                : ""
            }
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
            type="date"
            defaultValue={
              employment.probation_end_date
                ? employment.probation_end_date.slice(0, 10)
                : ""
            }
            className="w-full rounded-sm border-border text-sm text-secondary"
          />
        </div>

        {/* Manager */}
        <div className="min-w-0 space-y-2">
          <Label htmlFor="manager">Manager</Label>

          <Select defaultValue={employment.manager?.id ?? ""}>
            <SelectTrigger
              id="manager"
              className="w-full rounded-sm border-border text-sm"
            >
              <SelectValue placeholder="Select manager" />
            </SelectTrigger>

            <SelectContent>
              {/* Replace these with API managers later */}
              {employment.manager && (
                <SelectItem value={employment.manager.id}>
                  {employment.manager.name}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Work Email */}
        <div className="min-w-0 space-y-2 sm:col-span-2">
          <Label htmlFor="work_email">Work Email</Label>

          <Input
            id="work_email"
            type="email"
            defaultValue={employment.work_email ?? ""}
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
            defaultValue={
              employment.owns_personal_computer ? "yes" : "no"
            }
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
            type="date"
            defaultValue={
              employment.date_exited
                ? employment.date_exited.slice(0, 10)
                : ""
            }
            className="w-full rounded-sm border-border text-sm text-secondary"
          />
        </div>

        {/* Job Description */}
        <div className="min-w-0 space-y-2 sm:col-span-2">
          <Label htmlFor="job_description">Job Description</Label>

          <textarea
            id="job_description"
            defaultValue={employment.job_description ?? ""}
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