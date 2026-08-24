
import { api } from "@/lib";
import type { LocationResponse } from "../types/location.types";

export const getCountries = async (): Promise<LocationResponse> => {

    try {
        const response = await api.get<LocationResponse>("api/locations/countries");
        return response.data;
    }
    catch (error) {
        console.error("Getting Countries API Error:", error);
        throw error;
    }
}


export const getStates = async (countryCode: string): Promise<LocationResponse> => {

    try {
        const response = await api.get<LocationResponse>(`api/locations/countries/${countryCode}/states`);
        return response.data;
    } catch (error) {
        console.error("Getting States API Error:", error);
        throw error;
    }

};

export const getCities = async (countryCode: string, stateCode: string): Promise<LocationResponse> => {

    try {
        const response = await api.get<LocationResponse>(
            `api/locations/countries/${countryCode}/states/${stateCode}/cities`
        );

        console.log(response)
        return response.data;

        
    } catch (error) {
        console.error("Employee Getting Stated API Error:", error);
        throw error;
    }

};