import { useQuery } from "@tanstack/react-query";
import { getCities } from "../api/location.api";

export const useGetCities = (
  countryCode: string,
  stateCode: string
) => {
  return useQuery({
    queryKey: ["cities", countryCode, stateCode],
    queryFn: () => getCities(countryCode, stateCode),
    enabled: !!countryCode && !!stateCode,
  });
};