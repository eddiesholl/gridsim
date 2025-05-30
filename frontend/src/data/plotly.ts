import type { Shape } from "plotly.js";
import { DailyResponse, PlotlyData } from "../types";
import { getColourForString } from "./chart-colours";

type DailyDataOptions = {
  includeStoresE?: boolean;
  includeStoresP?: boolean;
  excludeData?: string[];
  extraShapes?: Partial<Shape>[];
};

type DataSet = [string, number[]];

export const shapeEveningPeak: Partial<Shape> = {
  type: "rect",
  xref: "x",
  yref: "paper",
  x0: "2016-01-01 15:00:00",
  y0: 0,
  x1: "2016-01-01 20:00:00",
  y1: 1,
  fillcolor: "#ffa3a3",
  opacity: 0.2,
  line: {
    width: 0,
  },
};

export const shapeMorningCommute: Partial<Shape> = {
  type: "rect",
  xref: "x",
  yref: "paper",
  x0: "2016-01-01 06:00:00",
  y0: 0,
  x1: "2016-01-01 08:00:00",
  y1: 1,
  fillcolor: "#a3a3ff",
  opacity: 0.2,
  line: {
    width: 0,
  },
  label: {
    text: "Morning commute",
    font: { size: 12, color: "black" },
    textposition: "top left",
  },
};

export const shapeEveningCommute: Partial<Shape> = {
  type: "rect",
  xref: "x",
  yref: "paper",
  x0: "2016-01-01 15:00:00",
  y0: 0,
  x1: "2016-01-01 17:00:00",
  y1: 1,
  fillcolor: "#a3a3ff",
  opacity: 0.2,
  line: {
    width: 0,
  },
  label: {
    text: "Evening commute",
    font: { size: 12, color: "black" },
    textposition: "top center",
  },
};

export const shapeChargeASAP: Partial<Shape> = {
  type: "rect",
  xref: "x",
  yref: "paper",
  x0: "2016-01-01 17:00:00",
  y0: 0,
  x1: "2016-01-01 19:00:00",
  y1: 1,
  fillcolor: "#ffa3a3",
  opacity: 0.4,
  line: {
    width: 0,
  },
  label: {
    text: "Charge by 7pm",
    font: { size: 12, color: "black" },
    textposition: "middle center",
  },
};

export const shapeChargeByMidnight: Partial<Shape> = {
  type: "rect",
  xref: "x",
  yref: "paper",
  x0: "2016-01-02 04:00:00",
  y0: 0,
  x1: "2016-01-02 06:00:00",
  y1: 1,
  fillcolor: "#ffa3a3",
  opacity: 0.4,
  line: {
    width: 0,
  },
  label: {
    text: "Charge by 6 am",
    font: { size: 12, color: "black" },
    textposition: "middle right",
  },
};

export const plotDailyLoadData = (
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

  const shapes = [shapeEveningPeak, ...(options.extraShapes || [])];

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
      shapes,
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

  return plotData;
};

export const plotDailyLinkData = (data: DailyResponse) => {
  const plotData = {
    data: Object.entries(data.links.p0).map(([name, values]) => ({
      type: "scatter",
      mode: "lines",
      name: name,
      x: data.index,
      y: values,
      line: {
        shape: "linear",
        color: getColourForString(name),
        width: 3,
      },
    })),
    layout: {
      title: {
        text: "Link power",
        font: {
          family: "Roboto, sans-serif",
          size: 24,
          color: "var(--mantine-color-dark-9)",
        },
      },
    },
  } as PlotlyData;

  return plotData;
};

type MarginalPriceOptions = {
  includeBuses?: string[];
};

export const plotDailyMarginalPriceData = (
  data: DailyResponse,
  options: MarginalPriceOptions = {}
) => {
  const fixedLines = Object.entries(data.marginal_prices).map(
    ([, metadata]) => ({
      type: "scatter",
      mode: "lines",
      name: metadata.name,
      x: [data.index[0], data.index[data.index.length - 1]],
      y: [metadata.marginal_cost, metadata.marginal_cost],
      line: {
        shape: "linear",
        color: getColourForString(metadata.name),
        width: 3,
        dash: "dot",
      },
      opacity: 0.8,
    })
  );

  const plotData = {
    data: Object.entries(data.buses.marginal_price)
      .filter(([name]) => options.includeBuses?.includes(name))
      .map(([name, values]) => ({
        type: "scatter",
        mode: "lines",
        name: `${name} (marginal price)`,
        x: data.index,
        y: values,
        line: {
          shape: "linear",
          color: getColourForString(name),
          width: 3,
        },
      }))
      .concat(fixedLines),
    layout: {
      title: {
        text: "Grid marginal price",
        font: {
          family: "Roboto, sans-serif",
          size: 24,
          color: "var(--mantine-color-dark-9)",
        },
      },
      yaxis: {
        title: {
          text: "Price ($/MWh)",
          font: {
            family: "Roboto, sans-serif",
            size: 16,
            color: "var(--mantine-color-dark-9)",
          },
        },
        rangemode: "tozero",
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
  } as PlotlyData;

  return plotData;
};

export const plotBatterySocData = (data: DailyResponse) => {
  const fixedLines = [
    {
      type: "scatter",
      mode: "lines",
      name: "Max capacity",
      x: [data.index[0], data.index[data.index.length - 1]],
      y: [
        data.params.number_of_evs! * data.params.ev_battery_size_mwh!,
        data.params.number_of_evs! * data.params.ev_battery_size_mwh!,
      ],
      line: {
        shape: "linear",
        color: getColourForString("Max capacity"),
        width: 3,
        dash: "dot",
      },
    },
    {
      type: "scatter",
      mode: "lines",
      name: "20% capacity",
      x: [data.index[0], data.index[data.index.length - 1]],
      y: [
        data.params.number_of_evs! * data.params.ev_battery_size_mwh! * 0.2,
        data.params.number_of_evs! * data.params.ev_battery_size_mwh! * 0.2,
      ],
      line: {
        shape: "linear",
        color: getColourForString("20% capacity"),
        width: 3,
        dash: "dot",
      },
    },
    {
      type: "scatter",
      mode: "lines",
      name: "50% capacity",
      x: [data.index[0], data.index[data.index.length - 1]],
      y: [
        data.params.number_of_evs! * data.params.ev_battery_size_mwh! * 0.5,
        data.params.number_of_evs! * data.params.ev_battery_size_mwh! * 0.5,
      ],
      line: {
        shape: "linear",
        color: getColourForString("20% capacity"),
        width: 3,
        dash: "dot",
      },
    },
  ];

  const plotData = {
    data: Object.entries(data.stores.e)
      .map(([name, values]) => ({
        type: "scatter",
        mode: "lines",
        name: name,
        x: data.index,
        y: values,
        line: {
          shape: "linear",
          color: getColourForString(name),
          width: 3,
        },
      }))
      .concat(fixedLines),
    layout: {
      title: {
        text: "Battery state of charge (SOC)",
      },
      yaxis: {
        rangemode: "tozero",
      },
    },
  } as PlotlyData;

  return plotData;
};

export const plotDailyGeneratorOutputData = (data: DailyResponse) => {
  const plotData = {
    data: Object.entries(data.generators.generators).map(([name, values]) => ({
      type: "scatter",
      mode: "lines",
      name: name,
      x: data.index,
      y: values.p,
      line: {
        shape: "linear",
        color: getColourForString(name),
        width: 3,
      },
    })),
  } as PlotlyData;

  return plotData;
};
