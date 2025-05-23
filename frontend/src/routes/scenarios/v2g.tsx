import { createFileRoute } from "@tanstack/react-router";
import { ScenariosV2G } from "../../pages/scenarios/v2g";
import { getDailyQuery } from "../../services/api";

export const Route = createFileRoute("/scenarios/v2g")({
  component: ScenariosV2G,
  loader: () => {
    const dailyDataA = getDailyQuery({ percent_of_evs_in_vpp: 0 });
    const dailyDataB = getDailyQuery({ percent_of_evs_in_vpp: 0.5 });
    return {
      dailyDataA,
      dailyDataB,
    };
  },
});
