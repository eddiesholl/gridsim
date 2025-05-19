import { createFileRoute } from "@tanstack/react-router";
import { ScenariosIntro } from "../../pages/scenarios/introduction";
import { getDailyQuery } from "../../services/api";

export const Route = createFileRoute("/scenarios/intro")({
  component: ScenariosIntro,
  loader: () => {
    const dailyData = getDailyQuery({ number_of_evs: 0 }, {});
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
