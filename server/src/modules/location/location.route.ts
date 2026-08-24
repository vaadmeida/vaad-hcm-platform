import { Router } from "express";
import { fetchCities, fetchCountries, fetchStates } from "./location.controller.ts";



const locationRouter = Router();

locationRouter.get("/countries", fetchCountries);
locationRouter.get("/countries/:countryCode/states",fetchStates);
locationRouter.get("/countries/:countryCode/states/:stateCode/cities",fetchCities);

export default locationRouter;