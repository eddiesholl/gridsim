import { Data, Layout } from "plotly.js";
import { components } from "./generated/api";

export type DailyResponse = components["schemas"]["DailyResponse"];
export type DailyParameters = components["schemas"]["DailyParameters"];
export type DailyScenario = {
  name: string;
  parameters: DailyParameters;
};

export type Scenarios = "intro" | "ev-charging" | "smart-charging" | "v2g";

export type DailyScenarioResult = DailyScenario & {
  response: DailyResponse;
};

export type Comparison = {
  before: DailyScenario;
  after: DailyScenario;
};

export type ComparisonResult = {
  before: DailyScenarioResult;
  after: DailyScenarioResult;
};

export type PlotlyData = {
  data: Data[];
  layout: Layout;
};
