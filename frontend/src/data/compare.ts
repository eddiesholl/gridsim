import { DailyScenarioResult } from "../types";

export function compareResults(
  before: Promise<DailyScenarioResult>,
  after: Promise<DailyScenarioResult>
) {
  return Promise.all([before, after]).then(([before, after]) => {
    return {
      before,
      after,
    };
  });
}
