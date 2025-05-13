import { AppShell, Burger, Group, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  createRootRoute,
  FileRouteTypes,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { MTLink } from "../components/Link";

// Define the type for each path object
interface PathConfig {
  path: FileRouteTypes["to"];
  label: string;
}

const paths: PathConfig[] = [
  {
    path: "/",
    label: "Home",
  },
  {
    path: "/tools",
    label: "Tools",
  },
  {
    path: "/scenarios",
    label: "Scenarios",
  },
  {
    path: "/about",
    label: "About",
  },
];

function RootComponent() {
  const [opened, { toggle }] = useDisclosure();
  return (
    <>
      <TanStackRouterDevtools />
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { desktop: true, mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header bg="moonstone.3">
          <Group h="100%" px="md">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Title order={1}>GridSim</Title>
            <Group justify="flex-end" style={{ flex: 1 }}>
              {/* <MantineLogo size={30} /> */}
              <Group ml="xl" gap={0} visibleFrom="sm">
                {paths.map(({ path, label }) => (
                  <MTLink key={path} to={path}>
                    {label}
                  </MTLink>
                ))}
              </Group>
            </Group>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar py="md" px={4}>
          {paths.map(({ path, label }) => (
            <MTLink key={path} to={path}>
              {label}
            </MTLink>
          ))}
        </AppShell.Navbar>

        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
      </AppShell>
    </>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
