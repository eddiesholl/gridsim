import { Data, Layout } from "plotly.js";
import { components } from "./generated/api";

export type DailyResponse = components["schemas"]["DailyResponse"];

export type PlotlyData = {
  data: Data[];
  layout: Layout;
};
