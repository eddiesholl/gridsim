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

export function ScenariosSmartCharging() {
  const { dailyDataA, dailyDataB } = getRouteApi(
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
          We'll give the EV and charger enough intelligence to choose when to
          recharge. Just make sure the battery is ready to go by 6am. The exact
          constraints could be based on an advanced dynamic signal using the
          real time wholesale electricity price, maybe part of a Virtual Power
          Plant (VPP). But it could also be as simple as a default charging time
          window. Many EVs have offered this feature for several years already.
          The goal is just to be recharged by midnight.
        </p>
        <p>
          This is already a significant improvement, saving consumers and the
          grid as a whole significant amount of money, and investment needed in
          the grid to handle the demand.
        </p>
      </Card>
      <Await promise={dailyDataB} fallback={<LoadingBlock />}>
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

      <Await
        promise={Promise.all([dailyDataA, dailyDataB])}
        fallback={<LoadingBlock />}
      >
        {([dataA, dataB]) => {
          const dailyMarginalPriceData = plotDailyMarginalPriceData(
            dataB.data,
            {
              includeBuses: ["Grid"],
            }
          );
          const batterySocData = plotBatterySocData(dataB.data);
          // const generatorOutputData = plotDailyGeneratorOutputData(data);
          return (
            <>
              <Card>
                <Flex>
                  <Plot
                    data={dailyMarginalPriceData.data}
                    layout={dailyMarginalPriceData.layout}
                  />
                  <MarginalPriceDelta dataA={dataA.data} dataB={dataB.data} />
                </Flex>
              </Card>
              <Card>
                <Plot
                  data={batterySocData.data}
                  layout={batterySocData.layout}
                />
              </Card>
            </>
          );
        }}
      </Await>
    </Flex>
  );
}
