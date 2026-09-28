import { Plus, Trash2 } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

import type { CreateEmployeeSalaryDTO } from "../../types/salary.types";

interface AdditionalEarningsFormProps {
  form: CreateEmployeeSalaryDTO;
  setForm: Dispatch<SetStateAction<CreateEmployeeSalaryDTO>>;
}

const AdditionalEarningsForm = ({
  form,
  setForm,
}: AdditionalEarningsFormProps) => {
  const addEarning = () => {
    setForm((prev) => ({
      ...prev,
      additionalEarnings: [
        ...prev.additionalEarnings,
        {
          name: "",
          amount: 0,
          frequency: "MONTHLY",
        },
      ],
    }));
  };

  const updateEarning = (
    index: number,
    field: "name" | "amount" | "frequency",
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      additionalEarnings: prev.additionalEarnings.map((earning, i) =>
        i === index
          ? {
              ...earning,
              [field]: field === "amount" ? Number(value) : value,
            }
          : earning
      ),
    }));
  };

  const removeEarning = (index: number) => {
    setForm((prev) => ({
      ...prev,
      additionalEarnings: prev.additionalEarnings.filter(
        (_, i) => i !== index
      ),
    }));
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Additional Earnings
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            Add allowances, bonuses, or other earnings outside the base salary.
          </p>
        </div>

        <button
          type="button"
          onClick={addEarning}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md bg-[#1078A9] px-3 text-sm font-medium text-white transition hover:bg-[#0d668f]"
        >
          <Plus className="h-4 w-4" />
          Add Earning
        </button>
      </div>

      {/* Empty State */}
      {form.additionalEarnings.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 px-6 py-10 text-center">
          <p className="text-sm font-medium text-gray-700">
            No additional earnings added
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Add items such as leave allowance, 13th month, or performance bonus.
          </p>

          <button
            type="button"
            onClick={addEarning}
            className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-md border border-[#1078A9] px-3 text-sm font-medium text-[#1078A9] transition hover:bg-[#1078A9]/5"
          >
            <Plus className="h-4 w-4" />
            Add Earning
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {form.additionalEarnings.map((earning, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_180px_160px_auto] sm:items-end">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600">
                    Earning Name
                  </label>

                  <input
                    type="text"
                    value={earning.name}
                    onChange={(e) =>
                      updateEarning(index, "name", e.target.value)
                    }
                    placeholder="e.g. Leave Allowance"
                    className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#1078A9] focus:ring-2 focus:ring-[#1078A9]/10"
                  />
                </div>

                {/* Amount */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600">
                    Amount
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={earning.amount || ""}
                    onChange={(e) =>
                      updateEarning(index, "amount", e.target.value)
                    }
                    placeholder="e.g. 29040"
                    className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#1078A9] focus:ring-2 focus:ring-[#1078A9]/10"
                  />
                </div>

                {/* Frequency */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600">
                    Frequency
                  </label>

                  <select
                    value={earning.frequency}
                    onChange={(e) =>
                      updateEarning(index, "frequency", e.target.value)
                    }
                    className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-[#1078A9] focus:ring-2 focus:ring-[#1078A9]/10"
                  >
                    <option value="MONTHLY">Monthly</option>
                    <option value="ANNUAL">Annual</option>
                    <option value="ONE_TIME">One Time</option>
                  </select>
                </div>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeEarning(index)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  aria-label="Remove earning"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdditionalEarningsForm;