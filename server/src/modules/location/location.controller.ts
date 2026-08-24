import { Request, Response } from "express";
import {
  getCountries,
  getStates,
  getCities,
} from "./location.service.ts";

export const fetchCountries = async (
  req: Request,
  res: Response
) => {
  try {
    const countries = await getCountries();

    return res.status(200).json({
      success: true,
      message: "Countries retrieved successfully",
      data: countries,
    });
  } catch (error) {
    console.error("Fetch countries error:", error);

    return res.status(502).json({
      success: false,
      message: "Unable to retrieve countries",
    });
  }
};

export const fetchStates = async (
  req: Request,
  res: Response
) => {
  try {
    const { countryCode } = req.params;

    if (typeof countryCode !== "string" || !countryCode) {
      return res.status(400).json({
        success: false,
        message: "Country code is required",
      });
    }

    const states = await getStates(countryCode.toUpperCase());

    return res.status(200).json({
      success: true,
      message: "States retrieved successfully",
      data: states,
    });
  } catch (error) {
    console.error("Fetch states error:", error);

    return res.status(502).json({
      success: false,
      message: "Unable to retrieve states",
    });
  }
};

export const fetchCities = async (
  req: Request,
  res: Response
) => {
  try {
    const { countryCode, stateCode } = req.params;

    if(typeof countryCode !== "string" ||!countryCode ||
         typeof stateCode !== "string" ||  !stateCode ) {
      return res.status(400).json({
        success: false,
        message: "Country code and state code are required",
      });
    }

    const cities = await getCities(
      countryCode.toUpperCase(),
      stateCode.toUpperCase()
    );

    return res.status(200).json({
      success: true,
      message: "Cities retrieved successfully",
      data: cities,
    });
  } catch (error) {
    console.error("Fetch cities error:", error);

    return res.status(502).json({
      success: false,
      message: "Unable to retrieve cities",
    });
  }
};