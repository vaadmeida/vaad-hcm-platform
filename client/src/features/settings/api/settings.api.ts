import { api } from "@/lib";
import type { OrganizationResponse, UpdateMyProfilePayload, UpdateMyProfileResponse, UpdateOrganizationPayload, UpdateOrganizationResponse } from "../types/settings.types";

export const updateMyProfile = async (data: UpdateMyProfilePayload): Promise<UpdateMyProfileResponse> => {
  const response = await api.patch<UpdateMyProfileResponse>(
    "/api/settings/profile",
    data
  );

  return response.data;
};



export const getOrganization = async (): Promise<OrganizationResponse> => {
  const response = await api.get<OrganizationResponse>("/api/settings/organization");

  return response.data;
};

export const updateOrganization = async (
  data: UpdateOrganizationPayload
): Promise<UpdateOrganizationResponse> => {

  const response = await api.patch<UpdateOrganizationResponse>(
    "/api/settings/organization", data
  );

  return response.data;
};


export const updateMyProfileAvatar = async (file: File): Promise<UpdateMyProfileResponse> => {

  const formData = new FormData();

  formData.append("avatar", file);

  const response = await api.patch<UpdateMyProfileResponse>(
    "/api/settings/profile/avatar",
    formData
  );

  return response.data;
};