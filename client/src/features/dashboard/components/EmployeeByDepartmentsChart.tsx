import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import type { EmployeesChart } from "../types/dashboard.type";

type EmployeeDepartmentChartProps = {
    data: EmployeesChart[];
};

const EmployeeByDepartmentChart = ({
    data,
}: EmployeeDepartmentChartProps) => {

    return (
        <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold">
                Employees by Department
            </h2>
            <ResponsiveContainer width="100%" height={220}>
                <BarChart
                    data={data}
                    barCategoryGap="40%"
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="department"
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={88}
                        tick={{ fontSize: 10 }}
                    />

                    <YAxis />

                    <Tooltip />

                    <Bar
                        dataKey="employees"
                        fill="#1078A9"
                        barSize={35}
                        radius={[8, 8, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default EmployeeByDepartmentChart;