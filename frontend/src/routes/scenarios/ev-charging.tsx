import { createFileRoute } from "@tanstack/react-router";
import { ScenariosEvCharging } from "../../pages/scenarios/ev-charging";
import { getDailyQuery } from "../../services/api";

export const Route = createFileRoute("/scenarios/ev-charging")({
  component: ScenariosEvCharging,
  loader: () => {
    const dailyDataA = getDailyQuery({ number_of_evs: 0 });
    const dailyDataB = getDailyQuery({ evening_recharge_time: 13 });
    return {
      dailyDataA,
      dailyDataB,
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
