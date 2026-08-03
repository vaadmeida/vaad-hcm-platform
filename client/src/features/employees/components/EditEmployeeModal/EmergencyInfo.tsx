import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UpdateEmployeeDTO } from "../../types/employee.types";

interface EmergencyInfoProps {
  form: UpdateEmployeeDTO;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const EmergencyInfo = ({
  form,
  handleChange,
}: EmergencyInfoProps) => {
  const inputClass =
    "h-10 w-full rounded-sm border-gray-200 text-sm font-medium text-[#121417] placeholder:text-gray-400 focus:border-[#1078A9] focus:ring-[#1078A9]/20";

  return (
    <div className="w-full">
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
            name="emergency_contact_name"
            value={form.emergency_contact_name ?? ""}
            onChange={handleChange}
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
            name="emergency_contact_relationship"
            value={form.emergency_contact_relationship ?? ""}
            onChange={handleChange}
            placeholder="e.g. Spouse, Parent, Sibling"
            className={inputClass}
          />
        </div>

        {/* Phone */}
        <div className="space-y-2 sm:col-span-2">
          <Label
            htmlFor="emergency_contact_number"
            className="text-sm font-medium text-gray-700"
          >
            Phone Number
          </Label>

          <Input
            id="emergency_contact_number"
            name="emergency_contact_number"
            type="tel"
            value={form.emergency_contact_number ?? ""}
            onChange={handleChange}
            placeholder="Enter phone number"
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
};

export default EmergencyInfo;