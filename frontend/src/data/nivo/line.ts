import { LineLayerId } from "@nivo/line";
import { ResponsiveMode } from "../../common/use-responsive-mode";
import { nivoTheme } from "../../styles/nivo";
import { NivoLineProps } from "./types";

type CustomLayer = Exclude<NivoLineProps["layers"], undefined>[number];
type CustomLayers = [number, CustomLayer][];

type CreateLinePropsOptions = {
  data: NivoLineProps["data"];
  xAxisText: string;
  markers?: NivoLineProps["markers"];
  customLayers?: CustomLayers;
  responsiveMode?: ResponsiveMode;
};

const mobileMargins = {
  top: 30,
  right: 30,
  bottom: 20,
  left: 30,
};

const fullMargins = {
  top: 50,
  right: 160,
  bottom: 50,
  left: 60,
};

export function createLineProps({
  data,
  xAxisText,
  markers,
  responsiveMode = "desktop",
  customLayers = [],
}: CreateLinePropsOptions): NivoLineProps {
  const defaultLayers: LineLayerId[] = [
    "axes",
    "grid",
    "areas",
    "lines",
    "markers",
    "points",
    "legends",
  ];
  const layers = defaultLayers.reduce((acc, curr, ix) => {
    const customLayer = customLayers.find(([target]) => ix === target);
    if (customLayer) {
      acc.push(customLayer[1]);
    }
    acc.push(curr);
    return acc;
  }, [] as CustomLayer[]);
  return {
    data,
    theme: nivoTheme,
    markers,
    colors: {
      scheme: "category10",
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
      legend: "Time of day",
      legendOffset: 36,
      tickValues:
        responsiveMode === "mobile" ? "every 4 hours" : "every 2 hours",

      //   legendPosition: "end",
    },
    gridXValues: "every 4 hours",
    layers,
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
    margin: responsiveMode === "mobile" ? mobileMargins : fullMargins,
    legends:
      responsiveMode === "mobile"
        ? []
        : [
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
