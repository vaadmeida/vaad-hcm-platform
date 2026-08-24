import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UpdateEmployeeDTO } from "../../types/employee.types";
import { useGetCountries } from "@/features/location/hooks/useGetCountries";
import { useGetStates } from "@/features/location/hooks/useGetStates";
import { useGetCities } from "@/features/location/hooks/useGetCities";


interface formInfoProps {
  form: UpdateEmployeeDTO;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const FormInfo = ({ form, handleChange }: formInfoProps) => {




  const { data: countries } = useGetCountries();

  const countryCode = countries?.data.find((country) => country.name === form.nationality)?.code ?? "";

  const { data: states } = useGetStates(countryCode);

  const stateCode = states?.data.find((state) => state.name === form.state_of_residence)?.code ?? "";


  const { data: cities } = useGetCities(countryCode,stateCode);


  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    
    handleChange(e);

    handleChange({
      target: {
        name: "state_of_residence",
        value: "",
      },
    } as React.ChangeEvent<HTMLSelectElement>);

    handleChange({
      target: {
        name: "city",
        value: "",
      },
    } as React.ChangeEvent<HTMLSelectElement>);
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleChange(e);

    handleChange({
      target: {
        name: "city",
        value: "",
      },
    } as React.ChangeEvent<HTMLSelectElement>);
  };

  const handleCityChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    handleChange(e);
  };


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

          <select
            id="nationality"
            name="nationality"
            value={form.nationality ?? ""}
            onChange={handleCountryChange}
            className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-secondary outline-none"
          >
            <option value="">Select Country</option>

            {countries?.data.map((country) => (
              <option key={country.id} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        {/* City */}
        <div className="min-w-0 space-y-2">
          <Label htmlFor="city">City</Label>
          <select
            id="city"
            name="city"
            value={form.city ?? ""}
            onChange={handleCityChange}
            className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-secondary outline-none"
          >
            <option value="">Select City</option>

            {cities?.data.map((city) => (
              <option key={city.id} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* State */}
        <div className="min-w-0 space-y-2">
          <Label htmlFor="state_of_residence">
            State of Residence
          </Label>
          <select
            id="state_of_residence"
            name="state_of_residence"
            value={form.state_of_residence ?? ""}
            onChange={handleStateChange}
            className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-secondary outline-none"
          >
            <option value="">Select State</option>

            {states?.data.map((state) => (
              <option key={state.id} value={state.name}>
                {state.name}
              </option>
            ))}
          </select>
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

export default FormInfo;