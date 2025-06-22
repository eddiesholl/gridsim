import {
  Box,
  Burger,
  Drawer,
  Flex,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FileRouteTypes, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useResponsiveMode } from "../../common/use-responsive-mode";
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
  const isMobile = useResponsiveMode() === "mobile";
  const [opened, { toggle }] = useDisclosure(false);
  return (
    <>
      <TanStackRouterDevtools position="bottom-left" />
      <Flex direction="column" h="100%" className={styles.root}>
        <Flex className={styles.header} p="sm">
          <Title order={1}>GridSim</Title>
          <Flex gap="md" align="center">
            {isMobile && (
              <>
                <Burger
                  opened={opened}
                  onClick={toggle}
                  hiddenFrom="sm"
                  size="sm"
                />
                <Drawer opened={opened} onClose={toggle} title="Menu">
                  {paths.map(({ path, label }) => (
                    <MTLink key={path} to={path} className={styles.link}>
                      {label}
                    </MTLink>
                  ))}
                </Drawer>
              </>
            )}
            {!isMobile &&
              paths.map(({ path, label }) => (
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
