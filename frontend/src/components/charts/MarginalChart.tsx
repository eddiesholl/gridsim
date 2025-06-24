import { Flex } from "@mantine/core";
import { ComparisonResult } from "../../types";
import { LineChart, LineChartProps } from "../LineChart";
import { MarginalPriceDelta } from "../MarginalPricedDelta";
import styles from "./styles.module.css";

type MarginalChartProps = {
  comparison?: ComparisonResult;
  lineProps: LineChartProps;
};

export function MarginalChart({ comparison, lineProps }: MarginalChartProps) {
  return (
    <Flex h="100%">
      <div className={styles.fullSize}>
        <LineChart {...lineProps} />
      </div>
      {comparison && <MarginalPriceDelta comparison={comparison} />}
    </Flex>
  );
}
