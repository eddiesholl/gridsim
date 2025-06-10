import { Card, Flex, Title } from "@mantine/core";
import { Await } from "@tanstack/react-router";
import { LineChart } from "../../../components/LineChart";
import { LoadingBlock } from "../../../components/LoadingBlock";
import {
  nivoDailyLoadData,
  nivoDailyMarginalPriceData,
} from "../../../data/nivo";
import { useScenarioData } from "../../../stores/scenario-data";

export function ScenariosIntro() {
  const { intro } = useScenarioData((state) => state.scenarios);

  return (
    <Flex direction="column" gap="lg">
      <Card>
        <Title order={2}>Introduction to our electricity grid</Title>
        <p>
          The modern electricity grid has evolved from a fairly dull system of
          fixed generation with little innovation, to a dynamic and evolving
          system of variable generation. Cheap but variable renewable energy,
          primarily from solar and wind, has been slowly replacing the fixed
          generation of coal and gas.
        </p>
        <p>
          Cheap solar is obviously most abundant in the middle of the day.
          Demand varies through the day, with the highest demand in the
          afternoon and early evening. This means the grid is over supplied with
          energy in the middle of the day, but stretched for supply in the late
          afternoon and evening. Wholesale electricity prices will normally be
          highest in this part of the day, as we need to call on all possible
          generation sources, especially the most expensive ones. This is where
          storage and demand response come into play, they are the ideal match
          to cheap renewables.
        </p>
        <p>
          The grid you see modelled here is simplified, but is roughly based on
          the National Electricity Market (NEM) in Australia.
        </p>
      </Card>

      {intro && (
        <>
          <Await promise={intro} fallback={<LoadingBlock />}>
            {({ response }) => {
              const foo = nivoDailyLoadData(response, {
                includeStoresE: false,
                includeStoresP: false,
                excludeData: ["EV driving"],
              });

              return (
                <Card>
                  <div style={{ height: 450 }}>
                    <LineChart {...foo} />
                  </div>
                </Card>
              );
            }}
          </Await>

          <Await promise={intro} fallback={<LoadingBlock />}>
            {({ response }) => {
              const dailyMarginalPriceData = nivoDailyMarginalPriceData(
                response,
                {
                  includeBuses: ["Grid"],
                }
              );
              return (
                <Card>
                  <div style={{ height: 450 }}>
                    <LineChart {...dailyMarginalPriceData} />
                  </div>
                </Card>
              );
            }}
          </Await>
        </>
      )}
    </Flex>
  );
}
