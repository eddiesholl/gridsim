import { Button, Flex } from "@mantine/core";
import { useResponsiveMode } from "../../common/use-responsive-mode";
import styles from "./styles.module.css";

type SelectableOption<T extends string> = {
  label: string;
  labelCompact: string;
  value: T;
};

type OptionSelectorProps<T extends string> = {
  options: SelectableOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function OptionSelector<T extends string>({
  options,
  value,
  onChange,
}: OptionSelectorProps<T>) {
  const isMobile = useResponsiveMode() === "mobile";

  if (isMobile) {
    return (
      <Flex direction="row" justify="space-between" w="100%">
        {options.map((item) => (
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
      {options.map((item) => (
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
