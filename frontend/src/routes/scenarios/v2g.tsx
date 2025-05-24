import { createFileRoute } from "@tanstack/react-router";
import { ScenariosV2G } from "../../pages/scenarios/v2g";
import { compareV2G } from "../../scenarios/daily";
import { getDailyComparison } from "../../services/api";

export const Route = createFileRoute("/scenarios/v2g")({
  component: ScenariosV2G,
  loader: () => {
    const compareV2GResult = getDailyComparison(compareV2G);
    return {
      compareV2GResult,
    };
  },
});
