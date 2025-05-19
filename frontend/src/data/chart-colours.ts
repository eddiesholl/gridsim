import { chartColorArray, chartColors } from "../styles/colors";

const fixedChartColors: Record<string, string> = {
  "Gas (cheap)": chartColors.yellowGreen,
  "Gas (moderate)": chartColors.steelBlue,
  "Gas (expensive)": chartColors.ultraViolet,
  Coal: chartColors.bittersweet,
  Solar: chartColors.sunglow,
  "Grid demand": chartColors.lightBlue,
  "Battery storage (MWh stored)": chartColors.tangerine,
};

export const getColourForString = (str: string) => {
  if (fixedChartColors[str]) {
    return fixedChartColors[str];
  }
  // If we don't have a fixed colour, convert the string to a number and use the chartColorArray
  const hash = str.split("").reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);

  return chartColorArray[hash % chartColorArray.length];
};
