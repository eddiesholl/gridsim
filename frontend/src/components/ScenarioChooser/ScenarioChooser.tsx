import { Button, Flex } from "@mantine/core";
import { useResponsiveMode } from "../../common/use-responsive-mode";
import { ScenarioDetails } from "../../types";
import styles from "./styles.module.css";

type ScenarioChooserProps = {
  scenarios: ScenarioDetails[];
  value: string;
  onChange: (value: string) => void;
};

export function ScenarioChooser({
  scenarios,
  value,
  onChange,
}: ScenarioChooserProps) {
  const isMobile = useResponsiveMode() === "mobile";

  if (isMobile) {
    return (
      <Flex direction="row" justify="space-between" w="100%">
        {scenarios.map((item) => (
          <Button
            className={styles.button}
            key={item.label}
            variant={value === item.value ? "filled" : "default"}
            onClick={() => onChange(item.value)}
            px="sm"
            fz="sm"
            h="40px"
          >
            {item.labelCompact}
          </Button>
        ))}
      </Flex>
    );
  }

  return (
    <Flex direction="row" justify="flex-end" w="100%" gap="md" p="sm">
      {scenarios.map((item) => (
        <Button
          key={item.label}
          variant={value === item.value ? "filled" : "default"}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </Button>
      ))}
    </Flex>
  );
}
