import type { Employee } from "@/features/employees/types/employee.types";
import {
  CalendarDays,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";

import InfoItem from "./InfoItem";

interface PersonalInformationProps {
  employee: Employee;
}

const PersonalInformation = ({
  employee,
}: PersonalInformationProps) => {
  const { personal } = employee;

  const formatDate = (date: string | null | undefined) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex items-center gap-2">
        <User className="h-4 w-4 shrink-0 text-[#1078A9]" />

        <h2 className="text-sm font-semibold text-[#121417]">
          Personal Information
        </h2>
      </div>

      {/* Information */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        <InfoItem
          label="First Name"
          value={personal.first_name}
        />

        <InfoItem
          label="Last Name"
          value={personal.last_name}
        />

        <InfoItem
          label="Gender"
          value={personal.gender}
        />

        <InfoItem
          label="Date of Birth"
          value={formatDate(personal.date_of_birth)}
          icon={<CalendarDays className="h-3.5 w-3.5" />}
        />

        <InfoItem
          label="Nationality"
          value={personal.nationality}
        />

        <InfoItem
          label="Email"
          value={personal.email}
          icon={<Mail className="h-3.5 w-3.5" />}
        />

        <InfoItem
          label="Phone"
          value={personal.phone}
          icon={<Phone className="h-3.5 w-3.5" />}
        />

        <InfoItem
          label="Alternate Phone"
          value={personal.alternate_phone}
        />

        <InfoItem
          label="City"
          value={personal.city}
          icon={<MapPin className="h-3.5 w-3.5" />}
        />

        <InfoItem
          label="State of Residence"
          value={personal.state_of_residence}
        />

        {/* Full width */}
        <div className="sm:col-span-2">
          <InfoItem
            label="Residential Address"
            value={personal.residential_address}
          />
        </div>
      </div>
    </section>
  );
};

export default PersonalInformation;