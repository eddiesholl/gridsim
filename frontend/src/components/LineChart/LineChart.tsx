import { ResponsiveLineCanvas } from "@nivo/line";
import { ComponentProps } from "react";

type LineChartProps = ComponentProps<typeof ResponsiveLineCanvas>;

export const LineChart = (props: LineChartProps) => {
  return <ResponsiveLineCanvas {...props} />;
};
