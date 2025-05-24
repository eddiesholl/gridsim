import { Flex, Text, Title } from "@mantine/core";
import { averageMarginalPrice } from "../../data/results";
import { roundTo } from "../../data/tools";
import { ComparisonResult } from "../../types";
import styles from "./styles.module.css";
type MarginalPriceDeltaProps = {
  comparison: ComparisonResult;
};

export function MarginalPriceDelta({ comparison }: MarginalPriceDeltaProps) {
  const averageMarginalPriceBefore = averageMarginalPrice(
    comparison.before.response
  );
  const averageMarginalPriceAfter = averageMarginalPrice(
    comparison.after.response
  );

  const increased = averageMarginalPriceAfter > averageMarginalPriceBefore;
  const percent =
    1 -
    Math.min(averageMarginalPriceAfter, averageMarginalPriceBefore) /
      Math.max(averageMarginalPriceAfter, averageMarginalPriceBefore);

  const percentDisplay = roundTo(percent * 100, 0);

  return (
    <Flex
      style={{ flex: 1, border: "1px solid red", minWidth: "300px" }}
      direction="column"
      gap="xs"
    >
      <Text style={{ textAlign: "center" }}>
        <Title order={4}>Daily average</Title>${averageMarginalPriceBefore}{" "}
        -&gt; ${averageMarginalPriceAfter}
        <Text className={styles.summaryNumber}>
          <b>
            {increased ? "+" : "-"}&nbsp;{percentDisplay}&nbsp;%
          </b>
        </Text>
      </Text>
    </Flex>
  );
}
