import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/scenarios/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Navigate to="/scenarios/intro" />;
}
