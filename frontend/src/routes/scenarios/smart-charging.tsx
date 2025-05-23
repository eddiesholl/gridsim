import { createFileRoute } from "@tanstack/react-router";
import { ScenariosSmartCharging } from "../../pages/scenarios/smart-charging";
import {
  scenarioEvCharging,
  scenarioSmartCharging,
} from "../../scenarios/daily";
import { getDailyQuery } from "../../services/api";

export const Route = createFileRoute("/scenarios/smart-charging")({
  component: ScenariosSmartCharging,
  loader: () => {
    const resultSmartCharging = getDailyQuery(scenarioSmartCharging);
    const resultEvCharging = getDailyQuery(scenarioEvCharging);
    return {
      resultSmartCharging,
      resultEvCharging,
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
