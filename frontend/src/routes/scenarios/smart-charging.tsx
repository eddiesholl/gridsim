import { createFileRoute } from "@tanstack/react-router";
import { ScenariosSmartCharging } from "../../pages/scenarios/smart-charging";

export const Route = createFileRoute("/scenarios/smart-charging")({
  component: ScenariosSmartCharging,
  onError: ({ error }) => {
    // Log the error
    console.error(error);
  },
  errorComponent: ({ error }) => {
    // Render an error message
    return <div>{error.message}</div>;
  },
});
