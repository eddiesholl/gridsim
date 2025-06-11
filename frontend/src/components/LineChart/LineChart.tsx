import { Flex, Text } from "@mantine/core";
import { ResponsiveLine } from "@nivo/line";
import { ComponentProps } from "react";

type LineChartProps = ComponentProps<typeof ResponsiveLine> & {
  title?: string;
};

export const LineChart = ({ title, ...props }: LineChartProps) => {
  return (
    <Flex h="100%" align="center" direction="column" w="100%">
      {title && <Text size="lg">{title}</Text>}
      <div style={{ height: 450, width: "100%" }}>
        <ResponsiveLine {...props} />
      </div>
    </Flex>
  );
};
