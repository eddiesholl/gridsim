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

export function ScenariosSmartCharging() {
  const { "ev-charging": evCharging, "smart-charging": smartCharging } =
    useScenarioData((state) => state.scenarios);
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

      {evCharging && smartCharging && (
        <>
          <Await
            promise={compareResults(evCharging, smartCharging)}
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
                //   shapeChargeByMidnight,
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
            promise={compareResults(evCharging, smartCharging)}
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
              // const generatorOutputData = plotDailyGeneratorOutputData(data);
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
                    <LineChart
                      {...batterySocData}
                      title="Battery state of charge (SOC)"
                    />
                  </Card>
                </>
              );
            }}
          </Await>
        </>
      )}
    </Flex>
  );
}
