import { useQuery } from "@tanstack/react-query";
import { getStates } from "../api/location.api";

export const useGetStates = (countryCode: string) => {
  return useQuery({
    queryKey: ["states", countryCode],
    queryFn: () => getStates(countryCode),
    enabled: !!countryCode,
  });
};