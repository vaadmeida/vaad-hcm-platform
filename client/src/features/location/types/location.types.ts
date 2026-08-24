export interface LocationItem {
  id: string;
  name: string;
  code?: string;
}

export interface LocationResponse {
  success: boolean;
  message: string;
  data: LocationItem[];
}