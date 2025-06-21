import { Button, Flex } from "@mantine/core";
import styles from "./styles.module.css";

type ScenarioChooserProps = {
  data: {
    label: string;
    value: string;
  }[];
  value: string;
  onChange: (value: string) => void;
};

export function ScenarioChooser({
  data,
  value,
  onChange,
}: ScenarioChooserProps) {
  return (
    <Flex direction="row" justify="space-between" w="100%">
      {data.map((item) => (
        <Button
          className={styles.button}
          key={item.value}
          variant={value === item.value ? "filled" : "default"}
          onClick={() => onChange(item.value)}
          px="sm"
          fz="xs"
        >
          {item.label}
        </Button>
      ))}
    </Flex>
  );
}
