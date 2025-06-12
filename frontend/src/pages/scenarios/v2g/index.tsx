import { Card, Flex, Title } from "@mantine/core";
import { Await } from "@tanstack/react-router";
import { LineChart } from "../../../components/LineChart";
import { LoadingBlock } from "../../../components/LoadingBlock";
import { MarginalPriceDelta } from "../../../components/MarginalPricedDelta";
import { compareResults } from "../../../data/compare";
import {
  nivoDailyLoadData,
  nivoDailyMarginalPriceData,
} from "../../../data/nivo";
import { nivoDailySocData } from "../../../data/nivo/daily-soc";
import { useScenarioData } from "../../../stores/scenario-data";
export function ScenariosV2G() {
  const { v2g, "smart-charging": smartCharging } = useScenarioData(
    (state) => state.scenarios
  );
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
      {v2g && smartCharging && (
        <>
          <Await
            promise={compareResults(smartCharging, v2g)}
            fallback={<LoadingBlock />}
          >
            {({ after }) => {
              const dailyLoadData = nivoDailyLoadData(after.response, {
                includeStoresE: true,
                includeStoresP: false,
                excludeData: ["EV driving", "Coal", "Solar"],
                //     extraShapes: [
                //   shapeMorningCommute,
                //   shapeEveningCommute,
                //   shapeChargeByMidnight,
                // ],
              });
              return (
                <Card>
                  <div style={{ height: 450 }}>
                    <LineChart {...dailyLoadData} title="Daily load" />
                  </div>
                </Card>
              );
            }}
          </Await>

          <Await
            promise={compareResults(smartCharging, v2g)}
            fallback={<LoadingBlock />}
          >
            {(comparison) => {
              const dailyMarginalPriceData = nivoDailyMarginalPriceData(
                comparison.after.response,
                {
                  includeBuses: ["Grid"],
                }
              );
              const batterySocData = nivoDailySocData(
                comparison.after.response
              );
              // const generatorOutputData = plotDailyGeneratorOutputData(
              //   comparison.after.response
              // );
              return (
                <>
                  <Card>
                    <Flex>
                      <div style={{ height: 450, width: "100%" }}>
                        <LineChart
                          {...dailyMarginalPriceData}
                          title="Marginal price"
                        />
                      </div>
                      <MarginalPriceDelta comparison={comparison} />
                    </Flex>
                  </Card>
                  <Card>
                    <LineChart
                      {...batterySocData}
                      title="Battery state of charge (SOC)"
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
        </>
      )}
    </Flex>
  );
}
