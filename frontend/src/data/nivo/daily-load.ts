import { DailyResponse } from "../../types";
import { AreaLayer } from "./area-layer";
import { serverToNivoData } from "./common";
import { createLineProps } from "./line";
import { DailyDataOptions, NivoLineProps } from "./types";

export const nivoDailyLoadData = (
  data: DailyResponse,
  options: DailyDataOptions = {}
) => {
  const storeEData = options.includeStoresE
    ? Object.entries(data.stores.e).map(
        ([name, values]) => [`${name} (MWh stored)`, values] as DataSet
      )
    : [];

  const storePData = options.includeStoresP
    ? Object.entries(data.stores.p).map(
        ([name, values]) => [`${name} (output)`, values] as DataSet
      )
    : [];

  // const shapes = [shapeEveningPeak, ...(options.extraShapes || [])];

  const generatorData = Object.entries(data.generators.generators).map(
    ([name, values]): [string, number[]] => [name, values.p]
  );
  const loadData = Object.entries(data.loads.p);

  const baseDataSets = generatorData
    .concat(loadData)
    .filter(([name]) => !options.excludeData?.includes(name))
    .map(([name, values]) => serverToNivoData(name, values, data.index));
  // .concat(Object.entries(data.loads.p) as DataSet[])
  // .concat(storeEData)
  // .concat(storePData);

  const markers: NivoLineProps["markers"] = [
    {
      legend: "Max capacity",
      // value: "8 AM", //data.index[0],
      value: new Date("2016-01-01 15:00:00"), //data.index[0],
      axis: "x",
      lineStyle: {
        stroke: "red",
        strokeWidth: 2,
      },
    },
    {
      legend: "Max capacity",
      value: "2016-01-01 16:00:00", //data.index[0],
      axis: "x",
      lineStyle: {
        stroke: "blue",
        strokeWidth: 2,
      },
    },
  ];

  return createLineProps({
    data: baseDataSets,
    xAxisText: "Power (MW)",
    // markers,
    customLayers: [
      [
        3,
        AreaLayer({
          startHour: "2016-01-01 06:00:00",
          endHour: "2016-01-01 08:00:00",
        }),
      ],
    ],
  });
};
