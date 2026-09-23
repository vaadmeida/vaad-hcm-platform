import type { SalaryComponent } from "@/features/salary/types/salary.types";

interface SalaryComponentsProps {
    components: SalaryComponent[];
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
    }).format(amount);
};

const SalaryComponents = ({
    components,
}: SalaryComponentsProps) => {

    const totalPercentage = components.reduce(
        (total, component) => total + Number(component.percentage),
        0
    );

    const totalAnnualAmount = components.reduce(
        (total, component) => total + Number(component.annualAmount),
        0
    );
    return (
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                <div>
                    <h2 className="text-base font-semibold text-gray-900">
                        Salary Components
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Breakdown of the employee's annual base salary.
                    </p>
                </div>

                <span className="rounded-full bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600">
                    {components.length}{" "}
                    {components.length === 1 ? "component" : "components"}
                </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/60">
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                                Component
                            </th>

                            <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">
                                Percentage
                            </th>

                            <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">
                                Annual Amount
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {components.map((component) => (
                            <tr
                                key={component.id}
                                className="transition hover:bg-gray-50/50"
                            >
                                <td className="px-6 py-4">
                                    <p className="text-sm font-medium text-gray-900">
                                        {component.name} allowance
                                    </p>
                                </td>

                                <td className="px-6 py-4 text-right">
                                    <span className="inline-flex rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                                        {component.percentage}%
                                    </span>
                                </td>

                                <td className="px-6 py-4 text-right">
                                    <p className="text-sm font-semibold text-gray-900">
                                        {formatCurrency(component.annualAmount)}
                                    </p>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                    {/* Total */}
                    <tfoot>
                        <tr className="border-t border-gray-200 bg-gray-50/60">
                            <td className="px-6 py-4">
                                <p className="text-sm font-semibold text-gray-900">
                                    Total
                                </p>
                            </td>

                            <td className="px-6 py-4 text-right">
                                <span
                                    className={`text-sm font-semibold ${Math.abs(totalPercentage - 100) < 0.01
                                            ? "text-emerald-600"
                                            : "text-red-600"
                                        }`}
                                >
                                    {totalPercentage}%
                                </span>
                            </td>

                            <td className="px-6 py-4 text-right">
                                <p className="text-sm font-bold text-gray-900">
                                    {formatCurrency(totalAnnualAmount)}
                                </p>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </section>
    );
};

export default SalaryComponents;