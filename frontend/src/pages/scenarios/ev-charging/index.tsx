import { Card, Flex, Text, Title } from "@mantine/core";
import { Await, getRouteApi } from "@tanstack/react-router";
import { LoadingBlock } from "../../../components/LoadingBlock";
import { Plot } from "../../../components/Plot/Plot";
import {
  plotDailyLoadData,
  plotDailyMarginalPriceData,
} from "../../../data/plotly";

export function ScenariosEvCharging() {
  const { dailyData } = getRouteApi("/scenarios/ev-charging").useLoaderData();
  return (
    <Flex direction="column" gap="lg">
      <Card>
        <Title order={2}>EV charging</Title>
        <Text>
          <p>
            First, we'll introduce a fleet of electric vehicles (EVs) to our
            grid. This will increase the demand on the grid. The fleet will
            start the day with full batteries, and end the day full again. They
            will simply start charging as soon as drivers return home from the
            evening commute.
          </p>
          <p>
            This defines our worst case scenario, a swe're adding demand right
            when the grid is least able to handle it.
          </p>
        </Text>
      </Card>
      <Await promise={dailyData} fallback={<LoadingBlock />}>
        {({ data }) => {
          const dailyLoadData = plotDailyLoadData(data, {
            includeStoresE: false,
            includeStoresP: false,
            excludeData: ["EV driving"],
          });
          return (
            <Plot data={dailyLoadData.data} layout={dailyLoadData.layout} />
          );
        }}
      </Await>

      <Await promise={dailyData} fallback={<LoadingBlock />}>
        {({ data }) => {
          const dailyMarginalPriceData = plotDailyMarginalPriceData(data, {
            includeBuses: ["Grid"],
          });
          return (
            <Plot
              data={dailyMarginalPriceData.data}
              layout={dailyMarginalPriceData.layout}
              rightText="Marginal price"
            />
          );
        }}
      </Await>
    </Flex>
  );
}
