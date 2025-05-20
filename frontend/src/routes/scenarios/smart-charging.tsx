import { createFileRoute } from "@tanstack/react-router";
import { ScenariosSmartCharging } from "../../pages/scenarios/smart-charging";
import { getDailyQuery } from "../../services/api";

export const Route = createFileRoute("/scenarios/smart-charging")({
  component: ScenariosSmartCharging,
  loader: () => {
    const dailyData = getDailyQuery({ percent_of_evs_in_vpp: 0 }, {});
    return {
      dailyData,
    };
  },
  onError: ({ error }) => {
    // Log the error
    console.error(error);
  },
  errorComponent: ({ error }) => {
    // Render an error message
    return <div>{error.message}</div>;
  },
});
