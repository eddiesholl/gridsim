import { chartColorArray } from "../styles/colors";
import { DailyResponse, PlotlyData } from "../types";

export const plotDailyLoadData = (data: DailyResponse) => {
  const plotData = {
    data: Object.entries(data.generators.generators)
      .map(([name, values]) => [name, values.p])
      .concat(Object.entries(data.loads.p))
      .concat(
        Object.entries(data.stores.e).map(([name, values]) => [
          `${name} (mwh stored)`,
          values,
        ])
      )
      .concat(
        Object.entries(data.stores.p).map(([name, values]) => [
          `${name} (output)`,
          values,
        ])
      )
      .map(([name, values], index) => ({
        type: "scatter",
        mode: "lines",
        name: name,
        x: data.index,
        y: values,
        line: {
          shape: "linear",
          color: chartColorArray[index % chartColorArray.length], // colorPalette[index % colorPalette.length],
          width: 3,
        },
      })),
    layout: {
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
  } as PlotlyData;

  return plotData;
};

export const plotDailyLinkData = (data: DailyResponse) => {
  const plotData = {
    data: Object.entries(data.links.p0).map(([name, values], index) => ({
      type: "scatter",
      mode: "lines",
      name: name,
      x: data.index,
      y: values,
      line: {
        shape: "linear",
        color: chartColorArray[index % chartColorArray.length], // colorPalette[index % colorPalette.length],
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

export const plotDailyMarginalPriceData = (data: DailyResponse) => {
  const plotData = {
    data: Object.entries(data.buses.marginal_price).map(
      ([name, values], index) => ({
        type: "scatter",
        mode: "lines",
        name: name,
        x: data.index,
        y: values,
        line: {
          shape: "linear",
          color: chartColorArray[index % chartColorArray.length],
          width: 3,
        },
      })
    ),

    layout: {
      title: {
        text: "Bus marginal price",
      },
    },
  } as PlotlyData;

  return plotData;
};

export const plotBatterySocData = (data: DailyResponse) => {
  const plotData = {
    data: Object.entries(data.stores.e)
      .map(([name, values], index) => ({
        type: "scatter",
        mode: "lines",
        name: name,
        x: data.index,
        y: values,
        line: {
          shape: "linear",
          color: chartColorArray[index % chartColorArray.length],
          width: 3,
        },
      }))
      .concat([
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
            color: "var(--mantine-color-dark-9)",
            width: 3,
          },
        },
      ]),
    layout: {
      title: {
        text: "Battery SOC",
      },
      yaxis: {
        rangemode: "tozero",
      },
    },
  } as PlotlyData;

  return plotData;
};
