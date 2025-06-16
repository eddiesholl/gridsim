import { ResponsiveLine } from "@nivo/line";
import { ComponentProps } from "react";

type LineChartProps = ComponentProps<typeof ResponsiveLine> & {
  title?: string;
};

export const LineChart = ({ ...props }: LineChartProps) => {
  return <ResponsiveLine {...props} />;
};
