import { Box, Flex, Space, Title, UnstyledButton } from "@mantine/core";
import { FileRouteTypes, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { MTLink } from "../../components/Link";
import { GitHubCat } from "../../icons/GitHubCat";
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
      <TanStackRouterDevtools position="top-left" />
      <Flex direction="column" h="100%" className={styles.root}>
        <Flex className={styles.header} p="sm">
          <Title order={1}>GridSim</Title>
          <Flex gap="md" align="center">
            {paths.map(({ path, label }) => (
              <MTLink key={path} to={path} className={styles.link}>
                {label}
              </MTLink>
            ))}
            <UnstyledButton
              component="a"
              href="https://github.com/eddiesholl/gridsim"
              target="_blank"
              className={styles.control}
            >
              <GitHubCat
                width={28}
                height={"auto"}
                className={styles.githubIcon}
              />
            </UnstyledButton>
            <Space w="sm" />
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
