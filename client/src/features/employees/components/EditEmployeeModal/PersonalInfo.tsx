import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UpdateEmployeeDTO } from "../../types/employee.types";


interface formInfoProps {
  form: UpdateEmployeeDTO;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const formInfo = ({ form, handleChange }: formInfoProps) => {

  return (
    <div className="w-full min-w-0">

      <div className="grid w-full min-w-0 grid-cols-1 gap-5 sm:grid-cols-2">
        {/* First Name */}
        <div className="min-w-0 space-y-2">
          <Label htmlFor="first_name">First Name</Label>
          <Input
            id="first_name"
            placeholder="Enter first name"
            defaultValue={form.first_name ?? ""}
            onChange={handleChange}
            className="w-full rounded-sm border-border text-sm text-secondary placeholder:text-gray-400"
          />
        </div>

        {/* Last Name */}
        <div className="min-w-0 space-y-2">
          <Label htmlFor="last_name">Last Name</Label>
          <Input
            id="last_name"
            defaultValue={form.last_name ?? ""}
            onChange={handleChange}
            className="w-full rounded-sm border-border text-sm text-secondary placeholder:text-gray-400"
          />
        </div>

        {/* Email */}
        <div className="min-w-0 space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            defaultValue={form.email ?? ""}
            onChange={handleChange}
            className="w-full rounded-sm border-border text-sm text-secondary placeholder:text-gray-400"
          />
        </div>

        {/* Phone */}
        <div className="min-w-0 space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            defaultValue={form.phone ?? ""}
            onChange={handleChange}
            className="w-full rounded-sm border-border text-sm text-secondary placeholder:text-gray-400"
          />
        </div>

        {/* Alternate Phone */}
        <div className="min-w-0 space-y-2">
          <Label htmlFor="alternate_phone">Alternate Phone</Label>
          <Input
            id="alternate_phone"
            defaultValue={form.alternate_phone ?? ""}
            onChange={handleChange}
            className="w-full rounded-sm border-border text-sm text-secondary placeholder:text-gray-400"
          />
        </div>

        {/* Gender */}
        <div className="min-w-0 space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Input
            id="gender"
            defaultValue={form.gender ?? ""}
            onChange={handleChange}
            className="w-full rounded-sm border-border text-sm text-secondary placeholder:text-gray-400"
          />
        </div>

        {/* Date of Birth */}
        <div className="min-w-0 space-y-2">
          <Label htmlFor="date_of_birth">Date of Birth</Label>
          <Input
            id="date_of_birth"
            type="date"
            defaultValue={
              form.date_of_birth
                ? form.date_of_birth.slice(0, 10)
                : ""
            }
            className="w-full rounded-sm border-border text-sm text-secondary placeholder:text-gray-400"
          />
        </div>

        {/* Nationality */}
        <div className="min-w-0 space-y-2">
          <Label htmlFor="nationality">Nationality</Label>
          <Input
            id="nationality"
            defaultValue={form.nationality ?? ""}
            className="w-full rounded-sm border-border text-sm text-secondary placeholder:text-gray-400"
          />
        </div>

        {/* City */}
        <div className="min-w-0 space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            defaultValue={form.city ?? ""}
            className="w-full rounded-sm border-border text-sm text-secondary placeholder:text-gray-400"
          />
        </div>

        {/* State */}
        <div className="min-w-0 space-y-2">
          <Label htmlFor="state_of_residence">
            State of Residence
          </Label>
          <Input
            id="state_of_residence"
            defaultValue={form.state_of_residence ?? ""}
            className="w-full rounded-sm border-border text-sm text-secondary placeholder:text-gray-400"
          />
        </div>

        {/* Residential Address */}
        <div className="min-w-0 space-y-2 sm:col-span-2">
          <Label htmlFor="residential_address">
            Residential Address
          </Label>
          <Input
            id="residential_address"
            defaultValue={form.residential_address ?? ""}
            className="w-full rounded-sm border-border text-sm text-secondary placeholder:text-gray-400"
          />
        </div>
      </div>
    </div>
  );
};

export default formInfo;