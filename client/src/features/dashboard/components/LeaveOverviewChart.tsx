import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import type { LeaveOverview } from "../types/dashboard.type";

type LeaveOverviewChartProps = {
  data: LeaveOverview[];
};

const COLORS: Record<string, string> = {
  approved: "#22C55E",
  pending: "#F59E0B",
  rejected: "#EF4444",
  cancelled: "#6B7280",
};

const LeaveOverviewChart = ({ data }: LeaveOverviewChartProps) => {
  const totalLeaves = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="rounded-xl bg-white p-5 shadow">
      <h2 className="mb-4 text-lg font-semibold">
        Leave Overview
      </h2>

      <div className="relative h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <Pie
              data={data}
              dataKey="count"
              nameKey="leaveStatus"
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="80%"
              paddingAngle={3}
              label={({ percent }) =>
                `${((percent ?? 0) * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {data.map((item) => (
                <Cell
                  key={item.leaveStatus}
                  fill={COLORS[item.leaveStatus] ?? "#94A3B8"}
                />
              ))}
            </Pie>

            <Tooltip />

            <Legend
              verticalAlign="bottom"
              height={36}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold">
            {totalLeaves}
          </span>

          <span className="text-sm text-gray-500">
            Total Leaves
          </span>
        </div>
      </div>
    </div>
  );
};

export default LeaveOverviewChart;