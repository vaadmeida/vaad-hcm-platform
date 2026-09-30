import { useQuery } from "@tanstack/react-query";
import { getOnboardingMaterials } from "../api/onboardingApi";

export const useOnboardingMaterials = () => {
  return useQuery({
    queryKey: ["onboarding-materials"],
    queryFn: getOnboardingMaterials,
  });
};
