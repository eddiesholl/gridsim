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
