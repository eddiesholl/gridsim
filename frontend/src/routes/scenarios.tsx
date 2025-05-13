import { AppShell, Stack, Title } from "@mantine/core";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { MTLink } from "../components/Link";

// Define scenario navigation items
const scenarioNavItems = [
  {
    path: "/scenarios/intro",
    label: "Introduction",
  },
];

export const Route = createFileRoute("/scenarios")({
  component: ScenariosLayout,
});

function ScenariosLayout() {
  return (
    <AppShell
      navbar={{
        width: 250,
        breakpoint: "sm",
      }}
      padding="md"
    >
      <AppShell.Navbar p="md" bg="moonstone.1">
        <Stack gap="md">
          <Title order={3}>Scenarios</Title>
          <Stack gap="xs">
            {scenarioNavItems.map(({ path, label }) => (
              <MTLink key={path} to={path}>
                {label}
              </MTLink>
            ))}
          </Stack>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
