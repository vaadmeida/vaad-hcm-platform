import { Plus, Trash2 } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

import type { CreateEmployeeSalaryDTO } from "../../types/salary.types";

interface SalaryComponentsFormProps {
    form: CreateEmployeeSalaryDTO;
    setForm: Dispatch<SetStateAction<CreateEmployeeSalaryDTO>>;
}

const SalaryComponentsForm = ({
    form,
    setForm,
}: SalaryComponentsFormProps) => {

    const addComponent = () => {
        setForm((prev) => ({
            ...prev,
            components: [
                ...prev.components,
                {
                    name: "",
                    percentage: 0,
                    annualAmount: 0,
                },
            ],
        }));
    };

  const updateComponent = (
  index: number,
  field: "name" | "percentage" | "annualAmount",
  value: string
) => {
  setForm((prev) => ({
    ...prev,
    components: prev.components.map((component, i) =>
      i === index
        ? {
            ...component,
            [field]:
              field === "name" ? value : Number(value),
          }
        : component
    ),
  }));
};

    const removeComponent = (index: number) => {
        setForm((prev) => ({
            ...prev,
            components: prev.components.filter((_, i) => i !== index),
        }));
    };

    const totalPercentage = form.components.reduce(
        (total, component) => total + component.percentage,
        0
    );

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                        Salary Components
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                        Define how the annual base salary is distributed across components.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={addComponent}
                    className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md bg-[#1078A9] px-3 text-sm font-medium text-white transition hover:bg-[#0d668f]"
                >
                    <Plus className="h-4 w-4" />
                    Add Component
                </button>
            </div>

            {/* Components */}
            {form.components.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 px-6 py-10 text-center">
                    <p className="text-sm font-medium text-gray-700">
                        No salary components added
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                        Add components such as Basic, Housing, Transport, or Medical.
                    </p>

                    <button
                        type="button"
                        onClick={addComponent}
                        className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-md border border-[#1078A9] px-3 text-sm font-medium text-[#1078A9] transition hover:bg-[#1078A9]/5"
                    >
                        <Plus className="h-4 w-4" />
                        Add Component
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {form.components.map((component, index) => (
                        <div
                            key={index}
                            className="rounded-lg border border-gray-200 bg-white p-4"
                        >
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_140px_160px_auto] sm:items-end">
                                {/* Name */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-gray-600">
                                        Component Name
                                    </label>

                                    <input
                                        type="text"
                                        value={component.name}
                                        onChange={(e) =>
                                            updateComponent(index, "name", e.target.value)
                                        }
                                        placeholder="e.g. Basic Salary"
                                        className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#1078A9] focus:ring-2 focus:ring-[#1078A9]/10"
                                    />
                                </div>

                                {/* Percentage */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-gray-600">
                                        Percentage
                                    </label>

                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={component.percentage || ""}
                                            onChange={(e) =>
                                                updateComponent(
                                                    index,
                                                    "percentage",
                                                    (e.target.value)
                                                )
                                            }
                                            placeholder="e.g. 22"
                                            className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 pr-8 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#1078A9] focus:ring-2 focus:ring-[#1078A9]/10"
                                        />

                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                                            %
                                        </span>
                                    </div>
                                </div>

                                {/* Annual Amount */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-gray-600">
                                        Annual Amount
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        value={component.annualAmount || ""}
                                        onChange={(e) =>
                                            updateComponent(
                                                index,
                                                "annualAmount",
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g. 290400"
                                        className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#1078A9] focus:ring-2 focus:ring-[#1078A9]/10"
                                    />
                                </div>

                                {/* Remove */}
                                <button
                                    type="button"
                                    onClick={() => removeComponent(index)}
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                                    aria-label="Remove component"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Percentage Summary */}
            {form.components.length > 0 && (
                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                    <span className="text-sm text-gray-600">
                        Total Allocation
                    </span>

                    <span
                        className={`text-sm font-semibold ${totalPercentage === 100
                                ? "text-green-600"
                                : "text-gray-900"
                            }`}
                    >
                        {totalPercentage}%
                    </span>
                </div>
            )}
        </div>
    );
};

export default SalaryComponentsForm;