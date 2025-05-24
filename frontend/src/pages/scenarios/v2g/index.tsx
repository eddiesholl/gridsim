import { Card, Flex, Title } from "@mantine/core";
import { Await, getRouteApi } from "@tanstack/react-router";
import { LoadingBlock } from "../../../components/LoadingBlock";
import { MarginalPriceDelta } from "../../../components/MarginalPricedDelta";
import { Plot } from "../../../components/Plot/Plot";
import {
  plotBatterySocData,
  plotDailyLoadData,
  plotDailyMarginalPriceData,
  shapeChargeByMidnight,
  shapeEveningCommute,
  shapeMorningCommute,
} from "../../../data/plotly";

export function ScenariosV2G() {
  const { compareV2GResult } = getRouteApi("/scenarios/v2g").useLoaderData();
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
      <Await promise={compareV2GResult} fallback={<LoadingBlock />}>
        {({ after }) => {
          const dailyLoadData = plotDailyLoadData(after.response, {
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
            <Card>
              <Plot data={dailyLoadData.data} layout={dailyLoadData.layout} />
            </Card>
          );
        }}
      </Await>

      <Await promise={compareV2GResult} fallback={<LoadingBlock />}>
        {(comparison) => {
          const dailyMarginalPriceData = plotDailyMarginalPriceData(
            comparison.after.response,
            {
              includeBuses: ["Grid"],
            }
          );
          const batterySocData = plotBatterySocData(comparison.after.response);
          // const generatorOutputData = plotDailyGeneratorOutputData(
          //   comparison.after.response
          // );
          return (
            <>
              <Card>
                <Flex>
                  <Plot
                    data={dailyMarginalPriceData.data}
                    layout={dailyMarginalPriceData.layout}
                  />
                  <MarginalPriceDelta comparison={comparison} />
                </Flex>
              </Card>
              <Card>
                <Plot
                  data={batterySocData.data}
                  layout={batterySocData.layout}
                />
              </Card>
              {/* <Card>
                <Plot
                  data={generatorOutputData.data}
                  layout={generatorOutputData.layout}
                />
              </Card> */}
            </>
          );
        }}
      </Await>
    </Flex>
  );
}
