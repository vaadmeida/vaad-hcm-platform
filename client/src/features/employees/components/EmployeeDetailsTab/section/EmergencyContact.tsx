import type { Employee } from "@/features/employees/types/employee.types";
import { Phone, ShieldUser } from "lucide-react";

import InfoItem from "./InfoItem";

interface EmergencyContactProps {
  employee: Employee;
}

const EmergencyContact = ({
  employee,
}: EmergencyContactProps) => {
  const { emergency_contact } = employee;

  return (
    <section className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex items-center gap-2">
        <ShieldUser className="h-4 w-4 shrink-0 text-[#1078A9]" />

        <h2 className="text-sm font-semibold text-[#121417]">
          Emergency Contact
        </h2>
      </div>

      {/* Information */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        <InfoItem
          label="Name"
          value={emergency_contact.name}
        />

        <InfoItem
          label="Relationship"
          value={emergency_contact.relationship}
        />

        <InfoItem
          label="Phone"
          value={emergency_contact.phone}
          icon={<Phone className="h-3.5 w-3.5" />}
        />
      </div>
    </section>
  );
};

export default EmergencyContact;