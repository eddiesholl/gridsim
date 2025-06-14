import { createFileRoute } from "@tanstack/react-router";
import { ScenariosIntro } from "../../pages/scenarios/introduction";
import {
  scenarioEvCharging,
  scenarioOriginalGrid,
  scenarioSmartCharging,
  scenarioV2G,
} from "../../scenarios/daily";
import { getDailyQuery } from "../../services/api";
export const Route = createFileRoute("/scenarios/intro")({
  component: ScenariosIntro,
  onError: ({ error }) => {
    // Log the error
    console.error(error);
  },
  errorComponent: ({ error }) => {
    // Render an error message
    return <div>{error.message}</div>;
  },
  // loader: async ({ context }) => {
  //   const ensureScenarios = useScenarioData((state) => state.ensureScenarios);
  //   await scenarios.ensureScenarios();
  //   return {
  //     scenarios,
  //   };
  // },
  loader: async () => {
    const intro = getDailyQuery(scenarioOriginalGrid);
    const evCharging = getDailyQuery(scenarioEvCharging);
    const smartCharging = getDailyQuery(scenarioSmartCharging);
    const v2g = getDailyQuery(scenarioV2G);
    return Promise.all([intro, evCharging, smartCharging, v2g]).then(
      ([intro, evCharging, smartCharging, v2g]) => {
        return {
          intro,
          evCharging,
          smartCharging,
          v2g,
        };
      }
    );
  },
});
