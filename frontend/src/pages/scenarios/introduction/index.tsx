import { Card, Flex, Text, Title } from "@mantine/core";
import { Await, getRouteApi } from "@tanstack/react-router";
import { LoadingBlock } from "../../../components/LoadingBlock";
import { Plot } from "../../../components/Plot/Plot";
import {
  plotDailyLoadData,
  plotDailyMarginalPriceData,
} from "../../../data/plotly";

export function ScenariosIntro() {
  const { dailyData } = getRouteApi("/scenarios/intro").useLoaderData();
  return (
    <Flex direction="column" gap="lg">
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
          <p>
            Cheap solar is obviously most abundant in the middle of the day.
            Demand varies through the day, with the highest demand in the early
            evening. This means the grid is over supplied with energy in the
            middle of the day, but stretched for supply in the late afternoon
            and evening. Wholesale electricity prices will normally be highest
            in this part of the day, as we need to call on all possible
            generation sources, especially the most expensive ones. This is
            where storage and demand response come into play, they are the ideal
            match to cheap renewables.
          </p>
          <p>
            The grid you see modelled here is simplified, but is roughly based
            on the National Electricity Market (NEM) in Australia.
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
      <Card>
        <Text>Grid marginal price</Text>
      </Card>
      <Await promise={dailyData} fallback={<LoadingBlock />}>
        {({ data }) => {
          const dailyMarginalPriceData = plotDailyMarginalPriceData(data, {
            includeBuses: ["Grid"],
          });
          return (
            <Plot
              data={dailyMarginalPriceData.data}
              layout={dailyMarginalPriceData.layout}
            />
          );
        }}
      </Await>
    </Flex>
  );
}
