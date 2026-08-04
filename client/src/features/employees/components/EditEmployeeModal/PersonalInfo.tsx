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
            name="first_name"
            placeholder="Enter first name"
            value={form.first_name ?? ""}
            onChange={handleChange}
            className="w-full rounded-sm border-border text-sm text-secondary placeholder:text-gray-400"
          />
        </div>

        {/* Last Name */}
        <div className="min-w-0 space-y-2">
          <Label htmlFor="last_name">Last Name</Label>
          <Input
            id="last_name"
            name="last_name"
            placeholder="Enter last name"
            value={form.last_name ?? ""}
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
            name="email"
            placeholder="Enter email"
            value={form.email ?? ""}
            onChange={handleChange}
            className="w-full rounded-sm border-border text-sm text-secondary placeholder:text-gray-400"
          />
        </div>

        {/* Phone */}
        <div className="min-w-0 space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            placeholder="Enter phone number"
            value={form.phone ?? ""}
            onChange={handleChange}
            className="w-full rounded-sm border-border text-sm text-secondary placeholder:text-gray-400"
          />
        </div>

        {/* Alternate Phone */}
        <div className="min-w-0 space-y-2">
          <Label htmlFor="alternate_phone">Alternate Phone</Label>
          <Input
            id="alternate_phone"
            name="alternate_phone"
            placeholder="Enter alternate phone number"
            value={form.alternate_phone ?? ""}
            onChange={handleChange}
            className="w-full rounded-sm border-border text-sm text-secondary placeholder:text-gray-400"
          />
        </div>

        {/* Gender */}
        <div className="min-w-0 space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Input
            id="gender"
            name="gender"
            placeholder="Enter gender"
            value={form.gender ?? ""}
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
            name="date_of_birth"
            placeholder="Enter date of birth"
            value={form.date_of_birth?.slice(0, 10)}
            onChange={handleChange}
            className="w-full rounded-sm border-border text-sm text-secondary placeholder:text-gray-400"
          />
        </div>

        {/* Nationality */}
        <div className="min-w-0 space-y-2">
          <Label htmlFor="nationality">Nationality</Label>
          <Input
            id="nationality"
            name="nationality"
            placeholder="Enter nationality"
            value={form.nationality ?? ""}
            onChange={handleChange}
            className="w-full rounded-sm border-border text-sm text-secondary placeholder:text-gray-400"
          />
        </div>

        {/* City */}
        <div className="min-w-0 space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            placeholder="Enter city"
            value={form.city ?? ""}
            onChange={handleChange}
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
            name="state_of_residence"
            placeholder="Enter state of residence"
            value={form.state_of_residence ?? ""}
            onChange={handleChange}
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
            name="residential_address"
            placeholder="Enter residential address"
            value={form.residential_address ?? ""}
            onChange={handleChange}
            className="w-full rounded-sm border-border text-sm text-secondary placeholder:text-gray-400"
          />
        </div>
      </div>
    </div>
  );
};

export default formInfo;