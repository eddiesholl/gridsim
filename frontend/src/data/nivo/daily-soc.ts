import { schemeCategory10 } from "d3-scale-chromatic";
import { DailyResponse } from "../../types";
import { serverToNivoData } from "./common";
import { createLineProps } from "./line";
import { NivoLineProps } from "./types";

export const nivoDailySocData = (
  data: DailyResponse
  // options: MarginalPriceOptions = {}
) => {
  const baseDataSets = Object.entries(data.stores.e)
    // .filter(([name]) => options.includeBuses?.includes(name))
    .map(([name, values]) =>
      serverToNivoData(`${name} (price)`, values, data.index)
    );

  const markers: NivoLineProps["markers"] = [
    {
      legend: "Max capacity",
      value: data.params.number_of_evs! * data.params.ev_battery_size_mwh!,
    },
    {
      legend: "20% capacity",
      value:
        data.params.number_of_evs! * data.params.ev_battery_size_mwh! * 0.2,
    },
    {
      legend: "50% capacity",
      value:
        data.params.number_of_evs! * data.params.ev_battery_size_mwh! * 0.5,
    },
  ].map(({ legend, value }, index) => ({
    legend,
    value,
    axis: "y",
    lineStyle: {
      stroke: schemeCategory10[index + 4],
      strokeWidth: 3,
      strokeDasharray: "4 4",
    },
  }));

  return createLineProps({
    data: baseDataSets,
    xAxisText: "MWh energy stored",
    markers,
  });
};
