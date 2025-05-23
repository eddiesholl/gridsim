import axios from "axios";
import {
  Comparison,
  ComparisonResult,
  DailyScenario,
  DailyScenarioResult,
} from "../types";
import { fetcher } from "./api-client";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
console.log(API_BASE_URL);
console.log(import.meta.env);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const healthCheck = async () => {
  const response = await api.get("/api/health");
  return response.data;
};

export const getHousehold = async () => {
  const response = await api.get("/api/household");
  return response.data;
};

export const getNem = async () => {
  const response = await api.get("/api/nem");
  return response.data;
};

const getDailyQueryFn = fetcher.path("/api/daily").method("get").create();
export const getDailyQuery = (
  scenario: DailyScenario
): Promise<DailyScenarioResult> => {
  const result = getDailyQueryFn(scenario.parameters);

  return result.then((response) => {
    return {
      ...scenario,
      response: response.data,
    };
  });
};

export const getDailyComparison = async (
  comparison: Comparison
): Promise<ComparisonResult> => {
  const before = await getDailyQuery(comparison.before);
  const after = await getDailyQuery(comparison.after);

  return Promise.all([before, after]).then(([before, after]) => {
    return {
      before,
      after,
    };
  });
};

export default api;
