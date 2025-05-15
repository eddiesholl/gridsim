import { createFileRoute } from "@tanstack/react-router";
import { ScenariosV2G } from "../pages/scenarios/v2g";

export const Route = createFileRoute("/scenarios/v2g")({
  component: ScenariosV2G,
});
