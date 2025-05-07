import { DailyResponse } from "../types";

export const sumGasUsage = (data: DailyResponse) => {
  console.log(data.generators.p);
  return data.generators.p.Gas.reduce((acc, curr) => acc + curr, 0);
};
