import { Box, Burger, Flex, Menu, Title, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChartLine,
  IconHome,
  IconQuestionMark,
  IconTool,
} from "@tabler/icons-react";
import { FileRouteTypes, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useResponsiveMode } from "../../common/use-responsive-mode";
import { MTLink } from "../../components/Link";
import { GitHubCat } from "../../icons/GitHubCat";
import styles from "./root.module.css";
interface PathConfig {
  path: FileRouteTypes["to"];
  label: string;
  icon?: React.ReactNode;
}

const paths: PathConfig[] = [
  {
    path: "/",
    label: "Home",
    icon: <IconHome />,
  },
  {
    path: "/scenarios",
    label: "Scenarios",
    icon: <IconChartLine />,
  },
  {
    path: "/tools",
    label: "Tools",
    icon: <IconTool />,
  },
  {
    path: "/about",
    label: "About",
    icon: <IconQuestionMark />,
  },
];

const devToolsEnabled = false;

export function RootComponent() {
  const isMobile = useResponsiveMode() === "mobile";
  const [opened, { toggle }] = useDisclosure(false);
  return (
    <>
      {devToolsEnabled && <TanStackRouterDevtools position="bottom-left" />}
      <Flex direction="column" h="100%" className={styles.root}>
        <Flex className={styles.header} p="sm">
          <Title order={1}>GridSim</Title>
          <Flex gap="md" align="center">
            {isMobile && (
              <Menu onClose={() => toggle()}>
                <Menu.Target>
                  <Burger opened={opened} onClick={toggle} />
                </Menu.Target>
                <Menu.Dropdown>
                  {paths.map(({ path, label, icon }) => (
                    <Menu.Item key={path} leftSection={icon}>
                      <MTLink to={path}>{label}</MTLink>
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
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
