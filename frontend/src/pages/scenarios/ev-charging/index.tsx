import { Card, Flex, Text, Title } from "@mantine/core";
import { Await, getRouteApi } from "@tanstack/react-router";
import { LoadingBlock } from "../../../components/LoadingBlock";
import { Plot } from "../../../components/Plot/Plot";
import {
  plotBatterySocData,
  plotDailyLoadData,
  plotDailyMarginalPriceData,
  shapeChargeASAP,
  shapeEveningCommute,
  shapeMorningCommute,
} from "../../../data/plotly";

export function ScenariosEvCharging() {
  const { dailyData } = getRouteApi("/scenarios/ev-charging").useLoaderData();
  return (
    <Flex direction="column" gap="lg">
      <Card>
        <Title order={2}>EV charging</Title>
        <Text>
          <p>
            First, we'll introduce a fleet of 200 electric vehicles (EVs) to our
            grid, each with an 80kWh battery. The daily recharge of the vehicles
            will increase the demand on the grid, once they have returned home
            after commuting. The fleet will start the day charged to 100%, and
            end the day at 100% again. To recharge after driving, they will
            simply start charging as soon as drivers return home and plug them
            in.
          </p>
          <p>
            We can now see the total energy stored in the batteries of all 200
            EVs in the chart, called 'Battery storage (MWh stored)'. We'll treat
            it as one large single battery. You can see the state drop during
            the morning and evening commute. Then when everyone plugs in when
            they get home, the cars just start charging straight away back to
            full.
          </p>
          <p>
            This defines our worst case scenario, as we're adding demand right
            when the grid is least able to handle it. The marginal price is
            higher now, as we need to call on more expensive backup generation
            reserves.
          </p>
        </Text>
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
              shapeChargeASAP,
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
          return (
            <>
              <Plot
                data={dailyMarginalPriceData.data}
                layout={dailyMarginalPriceData.layout}
              />
              <Plot data={batterySocData.data} layout={batterySocData.layout} />
            </>
          );
        }}
      </Await>
    </Flex>
  );
}
