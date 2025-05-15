import { createFileRoute } from "@tanstack/react-router";
import { ScenariosLayout } from "../pages/scenarios/scenarios";

export const Route = createFileRoute("/scenarios")({
  loader: () => {
    // return redirect({
    //   to: "/scenarios/intro",
    //   throw: true,
    // });
  },
  component: ScenariosLayout,
});
