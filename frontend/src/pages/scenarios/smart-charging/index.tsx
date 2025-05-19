import { Card, Flex, Title } from "@mantine/core";
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

export function ScenariosSmartCharging() {
  const { dailyData } = getRouteApi(
    "/scenarios/smart-charging"
  ).useLoaderData();
  return (
    <Flex direction="column" gap="lg">
      <Card>
        <Title order={2}>Smart charging</Title>
        <p>
          Obviously we don't want to increase demand when the grid is least able
          to handle it. Can we make a smarter choice about when we choose to
          recharge?
        </p>
        <p>
          This is already a significant improvement, saving consumers and the
          grid as a whole significant amount of money, and investment needed in
          the grid to handle the demand.
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
