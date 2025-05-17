import { createFileRoute } from "@tanstack/react-router";
import { ScenariosEvCharging } from "../../pages/scenarios/ev-charging";
import { getDailyQuery } from "../../services/api";

export const Route = createFileRoute("/scenarios/ev-charging")({
  component: ScenariosEvCharging,
  loader: () => {
    const dailyData = getDailyQuery({}, {});
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
