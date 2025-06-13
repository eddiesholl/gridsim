import { Flex } from "@mantine/core";
import { Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import { PageWrapper } from "../../components";
import { MTLink } from "../../components/Link";
import { useScenarioData } from "../../stores/scenario-data";
import styles from "./scenarios.module.css";
// Define scenario navigation items
const scenarioNavItems = [
  {
    path: "/scenarios/intro",
    label: "Introduction",
  },
  {
    path: "/scenarios/ev-charging",
    label: "EV charging",
  },
  {
    path: "/scenarios/smart-charging",
    label: "Smart charging",
  },
  {
    path: "/scenarios/v2g",
    label: "Vehicle to Grid",
  },
];

export function ScenariosLayout() {
  const { ensureScenarios } = useScenarioData();
  useEffect(() => {
    ensureScenarios();
  }, [ensureScenarios]);

  return (
    <>
      <Flex direction="column" gap="md">
        <Flex direction="row" justify="flex-end" gap="md" h="60px" p="md">
          {scenarioNavItems.map((item) => (
            <div key={item.path}>
              <MTLink className={styles.navItem} to={item.path}>
                {item.label}
              </MTLink>
            </div>
          ))}
        </Flex>
        <div className={styles.scrollArea}>
          <PageWrapper>
            <Flex direction="column" gap="lg" pt={0}>
              <Outlet />
            </Flex>
          </PageWrapper>
        </div>
      </Flex>
    </>
  );
}
