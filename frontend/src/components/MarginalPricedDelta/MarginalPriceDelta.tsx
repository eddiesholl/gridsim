import { averageMarginalPrice } from "../../data/results";
import { DailyResponse } from "../../types";

type MarginalPriceDeltaProps = {
  dataA: DailyResponse;
  dataB: DailyResponse;
};

export function MarginalPriceDelta({ dataA, dataB }: MarginalPriceDeltaProps) {
  const averageMarginalPriceA = averageMarginalPrice(dataA);
  const averageMarginalPriceB = averageMarginalPrice(dataB);
  return (
    <div>
      <p>Average marginal price A: {averageMarginalPriceA}</p>
      <p>Average marginal price B: {averageMarginalPriceB}</p>
      <p>
        Marginal price delta: {averageMarginalPriceB - averageMarginalPriceA}
      </p>
    </div>
  );
}
