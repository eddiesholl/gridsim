import { DailyResponse } from "../../types";
import { serverToNivoData } from "./common";
import { createLineProps } from "./line";
import { DailyDataOptions } from "./types";

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

  return createLineProps({
    data: baseDataSets,
    xAxisText: "Power (MW)",
  });
};
