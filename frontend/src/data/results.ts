import { DailyResponse } from "../types";

export const sumGasUsage = (data: DailyResponse) => {
  console.log(data.generators.generators.p);
  return Object.entries(data.generators.generators)
    .filter(([, value]) => value.carrier === "Gas")
    .reduce(
      (acc, [, value]) => acc + value.p.reduce((acc, curr) => acc + curr, 0),
      0
    );
};

export const averageMarginalPrice = (data: DailyResponse) => {
  const gridMarginalPrices = data.buses.marginal_price["grid"];
  return (
    gridMarginalPrices.reduce((acc, curr) => acc + curr, 0) /
    gridMarginalPrices.length
  );
};
