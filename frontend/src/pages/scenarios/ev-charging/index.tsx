import { Card, Flex, Title } from "@mantine/core";
import { Await } from "@tanstack/react-router";
import { LineChart } from "../../../components/LineChart";
import { LoadingBlock } from "../../../components/LoadingBlock";
import { MarginalPriceDelta } from "../../../components/MarginalPricedDelta";
import { Plot } from "../../../components/Plot/Plot";
import { compareResults } from "../../../data/compare";
import {
  nivoDailyLoadData,
  nivoDailyMarginalPriceData,
} from "../../../data/nivo";
import { plotBatterySocData } from "../../../data/plotly";
import { useScenarioData } from "../../../stores/scenario-data";
export function ScenariosEvCharging() {
  const { intro, "ev-charging": evCharging } = useScenarioData(
    (state) => state.scenarios
  );

  return (
    <>
      <Card>
        <Title order={2}>EV charging</Title>
        <p>
          First, we'll introduce a fleet of 200 electric vehicles (EVs) to our
          grid, each with an 80kWh battery. The daily recharge of the vehicles
          will increase the demand on the grid, once they have returned home
          after commuting. The fleet will start the day charged to 100%, and end
          the day at 100% again. To recharge after driving, they will simply
          start charging as soon as drivers return home and plug them in.
        </p>
        <p>
          We can now see the total energy stored in the batteries of all 200 EVs
          in the chart, called 'Battery storage (MWh stored)'. We'll treat it as
          one large single battery. You can see the state drop during the
          morning and evening commute. Then when everyone plugs in when they get
          home, the cars just start charging straight away back to full.
        </p>
        <p>
          This defines our worst case scenario, as we're adding demand right
          when the grid is least able to handle it. The marginal price is higher
          now, as we need to call on more expensive backup generation reserves.
        </p>
      </Card>
      {intro && evCharging && (
        <>
          <Await
            promise={compareResults(intro, evCharging)}
            fallback={<LoadingBlock />}
          >
            {({ after }) => {
              const dailyLoadData = nivoDailyLoadData(after.response, {
                includeStoresE: true,
                includeStoresP: false,
                excludeData: ["EV driving", "Coal", "Solar"],
                // extraShapes: [
                //   shapeMorningCommute,
                //   shapeEveningCommute,
                //   shapeChargeASAP,
                // ],
              });
              return (
                <Card>
                  <div style={{ height: 450 }}>
                    <LineChart {...dailyLoadData} />
                  </div>
                </Card>
              );
            }}
          </Await>

          <Await
            promise={compareResults(intro, evCharging)}
            fallback={<LoadingBlock />}
          >
            {(comparison) => {
              const dailyMarginalPriceData = nivoDailyMarginalPriceData(
                comparison.after.response,
                {
                  includeBuses: ["Grid"],
                }
              );
              const batterySocData = plotBatterySocData(
                comparison.after.response
              );
              return (
                <>
                  <Card>
                    <Flex>
                      <div style={{ height: 450, width: "100%" }}>
                        <LineChart {...dailyMarginalPriceData} />
                      </div>

                      <MarginalPriceDelta comparison={comparison} />
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
        </>
      )}
    </>
  );
}
