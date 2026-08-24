import { CSCountry, LocationItem } from "./location.types.ts";

const BASE_URL =
  process.env.CSC_API_BASE_URL ||
  "https://api.countrystatecity.in/v1";

const API_KEY = process.env.CSC_API_KEY;

if (!API_KEY) {
  throw new Error("CSC_API_KEY is not configured");
}

const headers = {
  "X-CSCAPI-KEY": API_KEY,
};

const request = async <T>(url: string): Promise<T> => {
  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.text();

    throw new Error(
      `Location API request failed: ${response.status} ${errorBody}`
    );
  }

  return response.json();
};

export const getCountries = async (): Promise<LocationItem[]> => {
  const countries = await request<CSCountry[]>(
    `${BASE_URL}/countries`
  );

  return countries.map((country) => ({
    id: String(country.id),
    name: country.name,
    code: country.iso2,
  }));
};

export const getStates = async (
  countryCode: string
): Promise<LocationItem[]> => {
  const states = await request<CSCountry[]>(
    `${BASE_URL}/countries/${countryCode}/states`
  );

  return states.map((state) => ({
    id: String(state.id),
    name: state.name,
    code: state.iso2,
  }));
};

export const getCities = async (countryCode: string,stateCode: string): Promise<LocationItem[]> => {
  const cities = await request<CSCountry[]>(
    `${BASE_URL}/countries/${countryCode}/states/${stateCode}/cities`
  );

  return cities.map((city) => ({
    id: String(city.id),
    name: city.name,
  }));
};