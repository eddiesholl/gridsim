import { Box, Flex, Title } from "@mantine/core";
import { FileRouteTypes, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { MTLink } from "../../components/Link";
import styles from "./root.module.css";
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
    path: "/scenarios",
    label: "Scenarios",
  },
  {
    path: "/tools",
    label: "Tools",
  },
  {
    path: "/about",
    label: "About",
  },
];

export function RootComponent() {
  return (
    <>
      <TanStackRouterDevtools />
      <Flex direction="column" h="100%">
        <Flex className={styles.header} p="sm">
          <Title order={1}>GridSim</Title>
          <Flex>
            {paths.map(({ path, label }) => (
              <MTLink key={path} to={path} className={styles.link}>
                {label}
              </MTLink>
            ))}
          </Flex>
        </Flex>
        <Flex className={styles.main}>
          <Box w="100%">
            <Outlet />
          </Box>
        </Flex>
      </Flex>
    </>
  );
}
