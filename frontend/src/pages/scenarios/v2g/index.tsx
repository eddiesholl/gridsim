import { Card, Flex, Title } from "@mantine/core";
import { Await, getRouteApi } from "@tanstack/react-router";
import { LoadingBlock } from "../../../components/LoadingBlock";
import { Plot } from "../../../components/Plot/Plot";
import {
  plotBatterySocData,
  plotDailyGeneratorOutputData,
  plotDailyLoadData,
  plotDailyMarginalPriceData,
  shapeChargeByMidnight,
  shapeEveningCommute,
  shapeMorningCommute,
} from "../../../data/plotly";

export function ScenariosV2G() {
  const { dailyData } = getRouteApi("/scenarios/v2g").useLoaderData();
  return (
    <Flex direction="column" gap="md">
      <Card>
        <Title order={2}>What is Vehicle to Grid?</Title>
        <p>
          Large scale storage of electricity, connected to the grid, is ideal to
          help ease the strain on the grid at times where it is hardest to match
          supply to demand. Let's leverage the energy stored in the EV fleet to
          help out here. We will enrol a part of our EV fleet in a V2G program.
          As well as drawing power from the grid to recharge, they're now also
          able to return power to the grid.
        </p>
        <p>
          By storing additional energy, then responding at critical times, we
          can ease the load on the grid even further. This means less capacity
          is needed from other sources jsut to cover the peak of each day,
          saving money and avoiding use of gas.
        </p>
      </Card>
      <Await promise={dailyData} fallback={<LoadingBlock />}>
        {({ data }) => {
          const dailyLoadData = plotDailyLoadData(data, {
            includeStoresE: true,
            includeStoresP: false,
            excludeData: ["EV driving", "Coal", "Solar"],
            extraShapes: [
              shapeMorningCommute,
              shapeEveningCommute,
              shapeChargeByMidnight,
            ],
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
          const batterySocData = plotBatterySocData(data);
          const generatorOutputData = plotDailyGeneratorOutputData(data);
          return (
            <>
              <Plot
                data={dailyMarginalPriceData.data}
                layout={dailyMarginalPriceData.layout}
              />
              <Plot data={batterySocData.data} layout={batterySocData.layout} />
              <Plot
                data={generatorOutputData.data}
                layout={generatorOutputData.layout}
              />
            </>
          );
        }}
      </Await>
    </Flex>
  );
}
