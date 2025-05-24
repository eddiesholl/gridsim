import { Card, Flex, Text, Title } from "@mantine/core";
import { averageMarginalPrice, totalDailyPrice } from "../../data/results";
import { roundTo } from "../../data/tools";
import { ComparisonResult } from "../../types";
import { DeltaPercent } from "../DeltaPercent";
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

  const totalDailyPriceBefore = totalDailyPrice(comparison.before.response);
  const totalDailyPriceAfter = totalDailyPrice(comparison.after.response);

  return (
    <Flex
      style={{ width: "250px" }}
      direction="column"
      gap="xs"
      justify="space-around"
    >
      <Card
        style={{
          flex: 1,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Title order={4}>Average marginal price</Title>$
        {roundTo(averageMarginalPriceBefore, 0)} -&gt; $
        {roundTo(averageMarginalPriceAfter, 0)}
        <Text className={styles.summaryNumber}>
          <b>
            <DeltaPercent
              before={averageMarginalPriceBefore}
              after={averageMarginalPriceAfter}
            />
          </b>
        </Text>
      </Card>
      <Card
        style={{
          flex: 1,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Text style={{ textAlign: "center" }}>
          <Title order={4}>Daily total cost</Title>$
          {roundTo(totalDailyPriceBefore, 0)} -&gt; $
          {roundTo(totalDailyPriceAfter, 0)}
          <Text className={styles.summaryNumber}>
            <b>
              <DeltaPercent
                before={totalDailyPriceBefore}
                after={totalDailyPriceAfter}
              />
            </b>
          </Text>
        </Text>
      </Card>
    </Flex>
  );
}
