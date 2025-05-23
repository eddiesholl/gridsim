import { createFileRoute } from "@tanstack/react-router";
import { ScenariosEvCharging } from "../../pages/scenarios/ev-charging";
import { compareEvCharging } from "../../scenarios/daily";
import { getDailyComparison } from "../../services/api";

export const Route = createFileRoute("/scenarios/ev-charging")({
  component: ScenariosEvCharging,
  loader: () => {
    const compareEvChargingResult = getDailyComparison(compareEvCharging);
    return {
      compareEvChargingResult,
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
