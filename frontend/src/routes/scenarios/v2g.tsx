import { createFileRoute } from "@tanstack/react-router";
import { ScenariosV2G } from "../../pages/scenarios/v2g";
import { scenarioSmartCharging, scenarioV2G } from "../../scenarios/daily";
import { getDailyQuery } from "../../services/api";

export const Route = createFileRoute("/scenarios/v2g")({
  component: ScenariosV2G,
  loader: () => {
    const resultSmartCharging = getDailyQuery(scenarioSmartCharging);
    const resultV2G = getDailyQuery(scenarioV2G);
    return {
      resultSmartCharging,
      resultV2G,
    };
  },
});
