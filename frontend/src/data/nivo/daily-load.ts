import { schemeCategory10 } from "d3-scale-chromatic";
import { DailyResponse } from "../../types";
import { serverToNivoData } from "./common";
import { createLineProps } from "./line";
import { TimeWindowLayer } from "./time-window-layer";
import { DailyDataOptions } from "./types";

export const nivoDailyLoadData = (
  data: DailyResponse,
  options: DailyDataOptions = {}
) => {
  const storeEData = options.includeStoresE
    ? Object.entries(data.stores.e).map(
        ([name, values]) =>
          [`${name} (MWh stored)`, values] as [string, number[]]
      )
    : [];

  const storePData = options.includeStoresP
    ? (Object.entries(data.stores.p).map(([name, values]) => [
        `${name} (output)`,
        values,
      ]) as [string, number[]][])
    : [];

  // const shapes = [shapeEveningPeak, ...(options.extraShapes || [])];

  const generatorData = Object.entries(data.generators.generators).map(
    ([name, values]): [string, number[]] => [name, values.p]
  );
  const loadData = Object.entries(data.loads.p);

  const baseDataSets = generatorData
    .concat(loadData)
    .concat(storeEData)
    .concat(storePData)
    .filter(([name]) => !options.excludeData?.includes(name))
    .map(([name, values]) => serverToNivoData(name, values, data.index));

  return createLineProps({
    data: baseDataSets,
    responsiveMode: options.responsiveMode,
    xAxisText: "Power (MW)",
    // markers,
    customLayers: [
      [
        3,
        TimeWindowLayer({
          timeWindows: [
            {
              startHour: "2016-01-01 06:00:00",
              endHour: "2016-01-01 08:00:00",
              text: "Morning commute",
              fillColor: schemeCategory10[8],
            },
            {
              startHour: "2016-01-01 15:00:00",
              endHour: "2016-01-01 20:00:00",
              text: "Evening peak",
              fillColor: schemeCategory10[3],
            },
          ],
        }),
      ],
    ],
  });
};
