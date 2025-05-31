import { ResponsiveLine } from "@nivo/line";
import { ComponentProps } from "react";
import { nivoTheme } from "../styles/nivo";
import { DailyResponse } from "../types";

type DailyDataOptions = {
  includeStoresE?: boolean;
  includeStoresP?: boolean;
  excludeData?: string[];
  // extraShapes?: Partial<Shape>[];
};

type NivoLineProps = ComponentProps<typeof ResponsiveLine>;

const serverToNivoData = (name: string, values: number[], index: string[]) => ({
  id: name,
  data: values.map((y, i) => ({ x: index[i], y })),
});

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

  console.log(baseDataSets);

  //   const plotData = {
  //     data: baseDataSets
  //       .filter(([name]) => !options.excludeData?.includes(name))
  //       .map(([name, values], setId) => ({
  //         type: "scatter",
  //         mode: "lines",
  //         name: name,
  //         x: data.index,
  //         y: values,
  //         ids: values.map((_v, pointId) => `${setId}-${pointId}`),
  //         line: {
  //           shape: "linear",
  //           color: getColourForString(name),
  //           width: 3,
  //         },
  //       })),
  //   } as unknown as PlotlyData;

  const result: NivoLineProps = {
    data: baseDataSets,
    theme: nivoTheme,
    // layers: [{}],
    colors: {
      scheme: "nivo",
    },
    xScale: {
      type: "time",
      format: "%Y-%m-%d %H:%M:%S",
      useUTC: false,
      precision: "hour",
    },
    yScale: {
      type: "linear",
    },
    axisLeft: {
      legend: "Power (MW)",
      legendOffset: -36,
    },
    axisBottom: {
      format: "%-I %p",
      tickValues: "every 2 hours",
      legend: "Time of day",
      legendOffset: 36,
      //   legendPosition: "end",
    },
    lineWidth: 4,
    tooltip: () => {
      return null;
    },
    // enablePoints: false,
    // enablePointLabel: true,
    pointSize: 16,
    pointBorderWidth: 1,
    pointBorderColor: {
      from: "color",
      modifiers: [["darker", 0.3]],
    },
    margin: { top: 50, right: 160, bottom: 50, left: 60 },
    legends: [
      {
        anchor: "bottom-right",
        direction: "column",
        translateX: 140,
        itemsSpacing: 2,
        itemWidth: 80,
        itemHeight: 12,
        symbolSize: 12,
        symbolShape: "circle",
      },
    ],
    // useMesh: true,
    // enableSlices: false,
    // width: 900,
    // height: 400,

    // margin: { top: 20, right: 20, bottom: 60, left: 80 },
    // data,
    // pointSize: 8,
    pointColor: { theme: "background" },
    // pointBorderWidth: 2,
    // pointBorderColor: { theme: 'background' },
  };

  return result;
};
