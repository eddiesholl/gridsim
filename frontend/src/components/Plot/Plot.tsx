import { Card, Flex, Text } from "@mantine/core";
import Plotly from "react-plotly.js";
import styles from "./styles.module.css";
type PlotProps = {
  data: Plotly.Data[];
  layout: Plotly.Layout;
  rightText?: string;
};

export function Plot({ data, layout, rightText }: PlotProps) {
  return (
    <Flex className={styles.root}>
      <Plotly data={data} layout={layout} className={styles.plot} />
      {rightText && (
        <Card withBorder className={styles.right}>
          <Text>{rightText}</Text>
        </Card>
      )}
    </Flex>
  );
}
