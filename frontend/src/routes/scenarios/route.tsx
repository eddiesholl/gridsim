import { createFileRoute } from "@tanstack/react-router";
import { ScenariosLayout } from "../../layouts/scenarios";

export const Route = createFileRoute("/scenarios")({
  component: ScenariosLayout,
});
