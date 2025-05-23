import { Card, Flex, Text } from "@mantine/core";
import { ComponentProps } from "react";
import Plotly from "react-plotly.js";
import styles from "./styles.module.css";
export type PlotProps = Omit<
  ComponentProps<typeof Plotly>,
  "data" | "layout"
> & {
  data: Partial<Plotly.Data>[];
  layout: Partial<Plotly.Layout>;
  rightText?: string;
};

export function Plot({ data, layout, rightText, ...rest }: PlotProps) {
  return (
    <Flex className={styles.root}>
      <Plotly data={data} layout={layout} className={styles.plot} {...rest} />
      {rightText && (
        <Card withBorder className={styles.right}>
          <Text>{rightText}</Text>
        </Card>
      )}
    </Flex>
  );
}
