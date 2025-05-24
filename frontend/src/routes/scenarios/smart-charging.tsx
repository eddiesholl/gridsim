import { createFileRoute } from "@tanstack/react-router";
import { ScenariosSmartCharging } from "../../pages/scenarios/smart-charging";
import { compareSmartCharging } from "../../scenarios/daily";
import { getDailyComparison } from "../../services/api";

export const Route = createFileRoute("/scenarios/smart-charging")({
  component: ScenariosSmartCharging,
  loader: () => {
    const compareSmartChargingResult = getDailyComparison(compareSmartCharging);
    return {
      compareSmartChargingResult,
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
