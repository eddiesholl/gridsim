import { nivoTheme } from "../../styles/nivo";
import { NivoLineProps } from "./types";

export function createLineProps(
  data: NivoLineProps["data"],
  xAxisText: string
): NivoLineProps {
  return {
    data,
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
      legend: xAxisText,
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
    pointColor: { theme: "background" },
  };
}
