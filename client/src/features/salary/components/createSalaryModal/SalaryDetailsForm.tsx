import type { Dispatch, SetStateAction } from "react";
import type { CreateEmployeeSalaryDTO } from "../../types/salary.types";

interface SalaryDetailsFormProps {
    form: CreateEmployeeSalaryDTO;
    setForm: Dispatch<SetStateAction<CreateEmployeeSalaryDTO>>;
}

const SalaryDetailsForm = ({
    form,
    setForm,
}: SalaryDetailsFormProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]:
                name === "effectiveDate"
                    ? value
                    : Number(value),
        }));
    };

    return (
        <div className="space-y-5">

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Annual Base Salary */}
                <div className="space-y-1.5">
                    <label
                        htmlFor="annualBaseSalary"
                        className="text-sm font-medium text-gray-700"
                    >
                        Annual Base Salary
                    </label>

                    <input
                        id="annualBaseSalary"
                        name="annualBaseSalary"
                        type="number"
                        min="0"
                        value={form.annualBaseSalary || ""}
                        onChange={handleChange}
                        placeholder="e.g. 1320000"
                        className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#1078A9] focus:ring-2 focus:ring-[#1078A9]/10"
                    />
                </div>

                {/* Effective Date */}
                <div className="space-y-1.5">
                    <label
                        htmlFor="effectiveDate"
                        className="text-sm font-medium text-gray-700"
                    >
                        Effective Date
                    </label>

                    <input
                        id="effectiveDate"
                        name="effectiveDate"
                        type="date"
                        value={form.effectiveDate}
                        onChange={handleChange}
                        className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-[#1078A9] focus:ring-2 focus:ring-[#1078A9]/10"
                    />
                </div>

                {/* Monthly Gross */}
                <div className="space-y-1.5">
                    <label
                        htmlFor="monthlyGross"
                        className="text-sm font-medium text-gray-700"
                    >
                        Monthly Gross
                    </label>

                    <input
                        id="monthlyGross"
                        name="monthlyGross"
                        type="number"
                        min="0"
                        value={form.monthlyGross || ""}
                        onChange={handleChange}
                        placeholder="e.g. 110000"
                        className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#1078A9] focus:ring-2 focus:ring-[#1078A9]/10"
                    />
                </div>

                {/* PAYE */}
                <div className="space-y-1.5">
                    <label
                        htmlFor="paye"
                        className="text-sm font-medium text-gray-700"
                    >
                        PAYE
                    </label>

                    <input
                        id="paye"
                        name="paye"
                        type="number"
                        min="0"
                        value={form.paye || ""}
                        onChange={handleChange}
                        placeholder="e.g. 3500"
                        className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#1078A9] focus:ring-2 focus:ring-[#1078A9]/10"
                    />
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="netPay" className="text-sm font-medium text-gray-700">
                        Net Monthly Pay
                    </label>

                    <input
                        id="netPay"
                        name="netPay"
                        type="number"
                        min="0"
                        value={form.netPay || ""}
                        onChange={handleChange}
                        placeholder="e.g. 106500"
                        className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#1078A9] focus:ring-2 focus:ring-[#1078A9]/10"
                    />
                </div>
            </div>
        </div>
    );
};

export default SalaryDetailsForm;