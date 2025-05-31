import { ResponsiveLine } from "@nivo/line";
import { ComponentProps } from "react";

type LineChartProps = ComponentProps<typeof ResponsiveLine>;

export const LineChart = (props: LineChartProps) => {
  return <ResponsiveLine {...props} />;
};
