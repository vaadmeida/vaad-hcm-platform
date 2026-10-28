
import type { Employee } from "@/features/employees/types/employee.types";
import { Mail, MapPin, Phone, Users } from "lucide-react";

import InfoItem from "./InfoItem";

interface NextOfKinInformationProps {
  employee: Employee;
}

const NextOfKinInformation = ({
  employee,
}: NextOfKinInformationProps) => {
  const nextOfKin = employee.next_of_kin;

  return (
    <section className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex items-center gap-2">
        <Users className="h-4 w-4 shrink-0 text-[#1078A9]" />

        <h2 className="text-sm font-semibold text-[#121417]">
          Next of Kin Information
        </h2>
      </div>

      {/* Information */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        <InfoItem
          label="Full Name"
          value={nextOfKin?.name}
        />

        <InfoItem
          label="Relationship"
          value={nextOfKin?.relationship}
        />

        <InfoItem
          label="Phone Number"
          value={nextOfKin?.phone}
          icon={<Phone className="h-3.5 w-3.5" />}
        />

        <InfoItem
          label="Email Address"
          value={nextOfKin?.email}
          icon={<Mail className="h-3.5 w-3.5" />}
        />

        <div className="sm:col-span-2">
          <InfoItem
            label="Address"
            value={nextOfKin?.address}
            icon={<MapPin className="h-3.5 w-3.5" />}
          />
        </div>
      </div>
    </section>
  );
};

export default NextOfKinInformation;
