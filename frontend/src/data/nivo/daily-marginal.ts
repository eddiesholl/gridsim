import { DailyResponse } from "../../types";
import { serverToNivoData } from "./common";
import { createLineProps } from "./line";
import { MarginalPriceOptions } from "./types";

export const nivoDailyMarginalPriceData = (
  data: DailyResponse,
  options: MarginalPriceOptions = {}
) => {
  const baseDataSets = Object.entries(data.buses.marginal_price)
    .filter(([name]) => options.includeBuses?.includes(name))
    .map(([name, values]) => serverToNivoData(name, values, data.index));

  return createLineProps(baseDataSets, "Price ($/MWh)");
};
