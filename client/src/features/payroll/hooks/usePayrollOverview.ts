import { useQuery } from "@tanstack/react-query";

import { getPayrollOverviewApi } from "../api/payroll.api";

export const usePayrollOverview = () =>
    useQuery({
        queryKey: ["payrolls", "overview"],
        queryFn: getPayrollOverviewApi,
    });