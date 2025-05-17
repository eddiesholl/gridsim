import { Card, Flex, Text } from "@mantine/core";
import Plotly from "react-plotly.js";

type PlotProps = {
  data: Plotly.Data[];
  layout: Plotly.Layout;
  rightText?: string;
};

export function Plot({ data, layout, rightText }: PlotProps) {
  return (
    <Flex>
      <Plotly
        data={data}
        layout={layout}
        style={{ flex: 1, height: "450px" }}
      />
      {rightText && (
        <Card withBorder miw={200} mah={450} my="md">
          <Text>{rightText}</Text>
        </Card>
      )}
    </Flex>
  );
}
