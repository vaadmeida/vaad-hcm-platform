import { useQuery } from "@tanstack/react-query";
import { getOrganization } from "../api/settings.api";

export const useGetOrganization = () => {
    return useQuery({
        queryKey: ["organization-settings"],
        queryFn: getOrganization,
    });
};
