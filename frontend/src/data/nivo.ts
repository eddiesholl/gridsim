import { ResponsiveLineCanvas } from "@nivo/line";
import { ComponentProps } from "react";
import { DailyResponse, PlotlyData } from "../types";
import { getColourForString } from "./chart-colours";

type DailyDataOptions = {
  includeStoresE?: boolean;
  includeStoresP?: boolean;
  excludeData?: string[];
  // extraShapes?: Partial<Shape>[];
};

type NivoLineProps = ComponentProps<typeof ResponsiveLineCanvas>;

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

  const baseDataSets = Object.entries(data.generators.generators)
    .map(([name, values]) => [name, values.p] as DataSet)
    .concat(Object.entries(data.loads.p) as DataSet[])
    .concat(storeEData)
    .concat(storePData);

  const plotData = {
    data: baseDataSets
      .filter(([name]) => !options.excludeData?.includes(name))
      .map(([name, values], setId) => ({
        type: "scatter",
        mode: "lines",
        name: name,
        x: data.index,
        y: values,
        ids: values.map((_v, pointId) => `${setId}-${pointId}`),
        line: {
          shape: "linear",
          color: getColourForString(name),
          width: 3,
        },
      })),
    layout: {
      // paper_bgcolor: "#eee",
      // plot_bgcolor: "#eee",
      transition: {
        duration: 5000,
        easing: "linear",
      },
      frame: {
        duration: 500,
      },
      // shapes,
      responsive: true,
      useResizeHandler: true,
      autosize: true,
      title: {
        text: "Daily Load Profile",
        font: {
          family: "Roboto, sans-serif",
          size: 24,
          color: "var(--mantine-color-dark-9)",
        },
      },
      font: {
        family: "Roboto, sans-serif",
        size: 14,
        color: "var(--mantine-color-dark-9)",
      },
      xaxis: {
        title: {
          text: "Time",
          font: {
            family: "Roboto, sans-serif",
            size: 16,
            color: "var(--mantine-color-dark-9)",
          },
        },
        tickfont: {
          family: "Roboto, sans-serif",
          size: 12,
          color: "var(--mantine-color-dark-7)",
        },
      },
      yaxis: {
        title: {
          text: "Power (MW)",
          font: {
            family: "Roboto, sans-serif",
            size: 16,
            color: "var(--mantine-color-dark-9)",
          },
        },
        tickfont: {
          family: "Roboto, sans-serif",
          size: 12,
          color: "var(--mantine-color-dark-7)",
        },
      },
      legend: {
        font: {
          family: "Roboto, sans-serif",
          size: 12,
          color: "var(--mantine-color-dark-9)",
        },
      },
    },
  } as unknown as PlotlyData;

  // console.log(
  //   plotData.data.filter((d) => d.name === "Gas (expensive)").map((d) => d.y)
  // );
  // console.log(
  //   plotData.data.filter((d) => d.name === "Gas (expensive)").map((d) => d.ids)
  // );

  const result: NivoLineProps = {
    data: [
      {
        id: "first",
        data: [
          {
            x: "2016-01-01 00:00:00",
            y: 10,
          },
          {
            x: "2016-01-01 01:00:00",
            y: 20,
          },
        ],
      },
    ],
    xScale: {
      type: "time",
      format: "%Y-%m-%d %H:%M:%S",
      precision: "hour",
    },
    yScale: {
      type: "linear",
    },
    axisLeft: {
      legend: "linear scale",
      legendOffset: 12,
    },
    axisBottom: {
      format: "%b %d",
      tickValues: "every 2 days",
      legend: "time scale",
      legendOffset: -12,
    },
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
