import { schemeCategory10 } from "d3-scale-chromatic";
import { DailyResponse } from "../../types";
import { serverToNivoData } from "./common";
import { createLineProps } from "./line";
import { MarginalPriceOptions, NivoLineProps } from "./types";

export const nivoDailyMarginalPriceData = (
  data: DailyResponse,
  options: MarginalPriceOptions = {}
) => {
  const baseDataSets = Object.entries(data.buses.marginal_price)
    .filter(([name]) => options.includeBuses?.includes(name))
    .map(([name, values]) =>
      serverToNivoData(`${name} (price)`, values, data.index)
    );

  const markers: NivoLineProps["markers"] = Object.entries(data.marginal_prices)
    .sort(([, a], [, b]) => a.marginal_cost - b.marginal_cost)
    .map(([, metadata], index) => ({
      axis: "y",
      value: metadata.marginal_cost,
      legend: metadata.name,
      lineStyle: {
        stroke: schemeCategory10[index + 4],
        strokeWidth: 3,
        strokeDasharray: "4 4",
      },
    }));

  return createLineProps({
    data: baseDataSets,
    xAxisText: "Price ($/MWh)",
    markers,
    responsiveMode: options.responsiveMode,
  });
};
