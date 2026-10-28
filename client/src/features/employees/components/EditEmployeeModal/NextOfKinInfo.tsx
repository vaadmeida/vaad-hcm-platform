
import type { ChangeEvent } from "react";
import type { UpdateEmployeeDTO } from "../../types/employee.types";

interface NextOfKinInfoProps {
  form: UpdateEmployeeDTO;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#1078A9] focus:ring-2 focus:ring-[#1078A9]/10";

const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";

const NextOfKinInfo = ({ form, handleChange }: NextOfKinInfoProps) => {
  return (
    <section className="mt-8 border-t border-gray-200 pt-6">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-[#121417]">
          Next of Kin Information
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          Add the contact details of the employee's next of kin.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="next_of_kin_name" className={labelClass}>
            Full Name
          </label>
          <input
            id="next_of_kin_name"
            name="next_of_kin_name"
            value={form.next_of_kin_name ?? ""}
            onChange={handleChange}
            className={inputClass}
            placeholder="Enter full name"
          />
        </div>

        <div>
          <label htmlFor="next_of_kin_relationship" className={labelClass}>
            Relationship
          </label>
          <input
            id="next_of_kin_relationship"
            name="next_of_kin_relationship"
            value={form.next_of_kin_relationship ?? ""}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g. Spouse, Sister, Brother"
          />
        </div>

        <div>
          <label htmlFor="next_of_kin_phone" className={labelClass}>
            Phone Number
          </label>
          <input
            id="next_of_kin_phone"
            name="next_of_kin_phone"
            type="tel"
            value={form.next_of_kin_phone ?? ""}
            onChange={handleChange}
            className={inputClass}
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <label htmlFor="next_of_kin_email" className={labelClass}>
            Email Address
          </label>
          <input
            id="next_of_kin_email"
            name="next_of_kin_email"
            type="email"
            value={form.next_of_kin_email ?? ""}
            onChange={handleChange}
            className={inputClass}
            placeholder="Enter email address"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="next_of_kin_address" className={labelClass}>
            Address
          </label>
          <textarea
            id="next_of_kin_address"
            name="next_of_kin_address"
            value={form.next_of_kin_address ?? ""}
            onChange={handleChange}
            className={`${inputClass} min-h-20 resize-y`}
            placeholder="Enter residential address"
            rows={3}
          />
        </div>
      </div>
    </section>
  );
};

export default NextOfKinInfo;
