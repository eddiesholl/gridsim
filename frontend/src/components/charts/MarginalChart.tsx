import { Flex } from "@mantine/core";
import { ComparisonResult } from "../../types";
import { LineChart, LineChartProps } from "../LineChart";
import { MarginalPriceDelta } from "../MarginalPricedDelta";

type MarginalChartProps = {
  comparison?: ComparisonResult;
  lineProps: LineChartProps;
};

export function MarginalChart({ comparison, lineProps }: MarginalChartProps) {
  return (
    <Flex h="100%">
      <div style={{ flex: 1, width: "100%", height: "100%" }}>
        <LineChart {...lineProps} />
      </div>
      {comparison && <MarginalPriceDelta comparison={comparison} />}
    </Flex>
  );
}
