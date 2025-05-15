import { Flex } from "@mantine/core";
import { Outlet } from "@tanstack/react-router";
import { MTLink } from "../../components/Link";
import classes from "./scenarios.module.css";
// Define scenario navigation items
const scenarioNavItems = [
  {
    path: "/scenarios/intro",
    label: "Introduction",
  },
  {
    path: "/scenarios/v2g",
    label: "Vehicle to Grid",
  },
];

export function ScenariosLayout() {
  return (
    <>
      <Flex direction="column" gap="md">
        <Flex direction="row" justify="flex-end" gap="md">
          {scenarioNavItems.map((item) => (
            <div className={classes["scenario-nav-wrapper"]}>
              <MTLink
                className={classes["scenario-nav-item"]}
                key={item.path}
                to={item.path}
              >
                {item.label}
              </MTLink>
            </div>
          ))}
        </Flex>
        <Outlet />
      </Flex>
    </>
  );
}
