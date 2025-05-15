import { Card, Flex, Text, Title } from "@mantine/core";
import { Await, getRouteApi } from "@tanstack/react-router";
import Plot from "react-plotly.js";
import { LoadingBlock } from "../../../components/LoadingBlock";
import { plotDailyLoadData } from "../../../data/plotly";

export function ScenariosIntro() {
  const { dailyData } = getRouteApi("/scenarios/intro").useLoaderData();
  return (
    <Flex direction="column" gap="md">
      <Card>
        <Title order={2}>Introduction to our electricity grid</Title>
        <Text>
          <p>
            The modern electricity grid has evolved from a fairly dull system of
            fixed generation with little innovation, to a dynamic and evolving
            system of variable generation. Cheap but variable renewable energy,
            primarily from solar and wind, has been slowly replacing the fixed
            generation of coal and gas.
          </p>
        </Text>
      </Card>
      <Await promise={dailyData} fallback={<LoadingBlock />}>
        {({ data }) => {
          const dailyLoadData = plotDailyLoadData(data);
          return (
            <Plot data={dailyLoadData.data} layout={dailyLoadData.layout} />
          );
        }}
      </Await>
    </Flex>
  );
}
