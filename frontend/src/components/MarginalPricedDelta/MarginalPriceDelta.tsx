import { Flex } from "@mantine/core";
import { averageMarginalPrice, totalDailyPrice } from "../../data/results";
import { ComparisonResult } from "../../types";
import { DeltaWidget } from "../DeltaWidget";
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
    <Flex direction="column" gap="xs" justify="space-around">
      <DeltaWidget
        priceBefore={averageMarginalPriceBefore}
        priceAfter={averageMarginalPriceAfter}
        fullTitle="Average marginal price"
        compactTitle="Avg price"
      />
      <DeltaWidget
        priceBefore={totalDailyPriceBefore}
        priceAfter={totalDailyPriceAfter}
        fullTitle="Daily total cost"
        compactTitle="Total cost"
      />
    </Flex>
  );
}
