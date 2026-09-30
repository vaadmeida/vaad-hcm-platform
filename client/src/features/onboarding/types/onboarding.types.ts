export type OnboardingMaterialType = "DOCUMENT" | "VIDEO";

export interface OnboardingMaterial {
  id: string;
  title: string;
  description: string | null;
  documentKey: string;
  documentUrl: string;
  type: OnboardingMaterialType;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OnboardingMaterialsResponse {
  success: boolean;
  message: string;
  data: OnboardingMaterial[];
}

export interface OnboardingMaterialResponse {
  success: boolean;
  message: string;
  data: OnboardingMaterial;
}