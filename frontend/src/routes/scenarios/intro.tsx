import { createFileRoute } from "@tanstack/react-router";
import { ScenariosIntro } from "../../pages/scenarios/introduction";
import { scenarioOriginalGrid } from "../../scenarios/daily";
import { getDailyQuery } from "../../services/api";
export const Route = createFileRoute("/scenarios/intro")({
  component: ScenariosIntro,
  loader: () => {
    const resultOriginalGrid = getDailyQuery(scenarioOriginalGrid);
    return {
      resultOriginalGrid,
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
