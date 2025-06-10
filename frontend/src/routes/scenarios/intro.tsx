import { createFileRoute } from "@tanstack/react-router";
import { ScenariosIntro } from "../../pages/scenarios/introduction";
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
});
