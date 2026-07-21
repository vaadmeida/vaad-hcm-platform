import { env } from "@/lib/env";
import axios from "axios";

export const api = axios.create({
  baseURL: env.apiURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});