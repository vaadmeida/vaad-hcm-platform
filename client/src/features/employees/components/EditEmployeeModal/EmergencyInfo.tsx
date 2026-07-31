import type { Employee } from "../../types/employee.types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmergencyInfoProps {
  employee: Employee;
}

const EmergencyInfo = ({ employee }: EmergencyInfoProps) => {
  const { emergency_contact } = employee;

  const inputClass =
    "h-10 w-full rounded-sm border-gray-200 text-sm font-medium text-[#121417] placeholder:text-gray-400 focus:border-[#1078A9] focus:ring-[#1078A9]/20";

  return (
    <form className="w-full">
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Contact Name */}
        <div className="space-y-2">
          <Label
            htmlFor="emergency_contact_name"
            className="text-sm font-medium text-gray-700"
          >
            Contact Name
          </Label>

          <Input
            id="emergency_contact_name"
            defaultValue={emergency_contact?.name ?? ""}
            placeholder="Enter contact name"
            className={inputClass}
          />
        </div>

        {/* Relationship */}
        <div className="space-y-2">
          <Label
            htmlFor="emergency_contact_relationship"
            className="text-sm font-medium text-gray-700"
          >
            Relationship
          </Label>

          <Input
            id="emergency_contact_relationship"
            defaultValue={emergency_contact?.relationship ?? ""}
            placeholder="e.g. Spouse, Parent, Sibling"
            className={inputClass}
          />
        </div>

        {/* Phone */}
        <div className="space-y-2 sm:col-span-2">
          <Label
            htmlFor="emergency_contact_phone"
            className="text-sm font-medium text-gray-700"
          >
            Phone Number
          </Label>

          <Input
            id="emergency_contact_phone"
            type="tel"
            defaultValue={emergency_contact?.phone ?? ""}
            placeholder="Enter phone number"
            className={inputClass}
          />
        </div>
      </div>
    </form>
  );
};

export default EmergencyInfo;
