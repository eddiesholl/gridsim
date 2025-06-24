import { Flex, Loader } from "@mantine/core";
import styles from "./styles.module.css";

type LoadingBlockProps = {
  height?: string;
};

export function LoadingBlock({ height = "300px" }: LoadingBlockProps) {
  return (
    <Flex className={styles.wrapper} h={height}>
      <Loader type="bars" color="var(--mantine-color-coral-5)" />
    </Flex>
  );
}
