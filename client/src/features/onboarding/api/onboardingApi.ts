import { api } from "@/lib";
import type { OnboardingMaterialResponse, OnboardingMaterialsResponse } from "../types/onboarding.types";


export const getOnboardingMaterials = async (): Promise<OnboardingMaterialsResponse> => {
  const response = await api.get<OnboardingMaterialsResponse>("/api/onboarding/materials");

  return response.data;
};

export const createOnboardingMaterial = async (formData: FormData): Promise<OnboardingMaterialResponse> => {
  const response = await api.post<OnboardingMaterialResponse>("/api/onboarding/materials",
    formData
  );

  return response.data;
};


export const updateOnboardingMaterial = async ( id: string,formData: FormData): Promise<OnboardingMaterialResponse> => {
  const response = await api.patch<OnboardingMaterialResponse>(
     `/api/onboarding/materials/${id}`,
    formData
  );

  return response.data;
};

export const deleteOnboardingMaterial = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete<{ success: boolean; message: string }>(
    `/api/onboarding/materials/${id}`
  );

  return response.data;
};