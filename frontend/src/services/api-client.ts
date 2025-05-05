import { Fetcher } from "openapi-typescript-fetch";
import { paths } from "../generated/api";

// Create a fetcher instance
export const fetcher = Fetcher.for<paths>();

// Configure the fetcher
fetcher.configure({
  baseUrl: import.meta.env.VITE_API_URL || "http://localhost:8000",
  init: {
    headers: {
      "Content-Type": "application/json",
    },
  },
});
