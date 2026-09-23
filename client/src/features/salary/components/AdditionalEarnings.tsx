import type { AdditionalEarning } from "@/features/salary/types/salary.types";

interface AdditionalEarningsProps {
  earnings: AdditionalEarning[];
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

const formatFrequency = (frequency: AdditionalEarning["frequency"]) => {
  switch (frequency) {
    case "MONTHLY":
      return "Monthly";
    case "ANNUAL":
      return "Annual";
    case "ONE_TIME":
      return "One-time";
    default:
      return frequency;
  }
};

const AdditionalEarnings = ({
  earnings,
}: AdditionalEarningsProps) => {
  const totalAmount = earnings.reduce(
    (total, earning) => total + Number(earning.amount),
    0
  );

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Additional Earnings
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Bonuses, allowances, and other earnings outside the base salary.
          </p>
        </div>

        <span className="rounded-full bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600">
          {earnings.length}{" "}
          {earnings.length === 1 ? "earning" : "earnings"}
        </span>
      </div>

      {/* Table */}
      {earnings.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Earning
                </th>

                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Amount
                </th>

                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Frequency
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {earnings.map((earning) => (
                <tr
                  key={earning.id}
                  className="transition hover:bg-gray-50/50"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">
                      {earning.name}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(Number(earning.amount))}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                      {formatFrequency(earning.frequency)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr className="border-t border-gray-200 bg-gray-50/60">
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-gray-900">
                    Total
                  </p>
                </td>

                <td className="px-6 py-4 text-right">
                  <p className="text-sm font-bold text-gray-900">
                    {formatCurrency(totalAmount)}
                  </p>
                </td>

                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <div className="px-6 py-10 text-center">
          <p className="text-sm font-medium text-gray-700">
            No additional earnings
          </p>

          <p className="mt-1 text-sm text-gray-400">
            No bonuses, allowances, or other earnings have been added.
          </p>
        </div>
      )}
    </section>
  );
};

export default AdditionalEarnings;