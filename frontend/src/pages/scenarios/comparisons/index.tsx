import {
  Card,
  Flex,
  RangeSlider,
  SegmentedControl,
  Text,
  Title,
} from "@mantine/core";
import { useMap } from "@mantine/hooks";
import { Await } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LineChart } from "../../../components/LineChart";
import { LoadingBlock } from "../../../components/LoadingBlock";
import {
  nivoDailyLoadData,
  nivoDailyMarginalPriceData,
} from "../../../data/nivo";
import {
  scenarioEvCharging,
  scenarioOriginalGrid,
  scenarioSmartCharging,
  scenarioV2G,
} from "../../../scenarios/daily";
import { getDailyQuery } from "../../../services/api";
import { DailyScenario, DailyScenarioResult } from "../../../types";
import styles from "./styles.module.css";

type ScenarioId = 0 | 1 | 2 | 3;
const isScenarioId = (value: number): value is ScenarioId => {
  return value >= 0 && value <= 3;
};

const scenarioNames: Record<ScenarioId, string> = {
  0: "Introduction",
  1: "EV charging",
  2: "Smart charging",
  3: "Vehicle to Grid",
};

const scenarioLookup: Record<ScenarioId, DailyScenario> = {
  0: scenarioOriginalGrid,
  1: scenarioEvCharging,
  2: scenarioSmartCharging,
  3: scenarioV2G,
};

const useCachedQuery = (scenarioId: ScenarioId) => {
  const promiseMap = useMap<ScenarioId, Promise<DailyScenarioResult>>();
  const promise = promiseMap.get(scenarioId);
  if (promise) {
    return promise;
  }
  const result = getDailyQuery(scenarioLookup[scenarioId]);
  promiseMap.set(scenarioId, result);
  return result;
};

export function ScenariosIntro() {
  const [scenarioIds, setScenarioIds] = useState<[ScenarioId, ScenarioId]>([
    0, 1,
  ]);

  const beforeResult = useCachedQuery(scenarioIds[0]);
  const afterResult = useCachedQuery(scenarioIds[1]);

  const switcherValues = useMemo(() => {
    return [
      {
        value: "before",
        label: `Before (${scenarioNames[scenarioIds[0]]})`,
      },
      {
        value: "after",
        label: `After (${scenarioNames[scenarioIds[1]]})`,
      },
    ];
  }, [scenarioIds]);

  const [switcherValue, setSwitcherValue] = useState<"before" | "after">(
    "before"
  );

  const subjectScenario =
    switcherValue === "before" ? beforeResult : afterResult;

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
      <Flex w="50%" justify="space-between" gap="xl" py="md" direction="column">
        <Flex className={styles.flex08} gap="lg">
          <Text>Select your scenarios:</Text>
          <RangeSlider
            pt={8}
            className={styles.flex1}
            color="blue"
            showLabelOnHover={false}
            label={null}
            restrictToMarks
            defaultValue={[0, 1]}
            min={0}
            max={3}
            marks={[
              { value: 0, label: "Introduction" },
              { value: 1, label: "EV charging" },
              { value: 2, label: "Smart charging" },
              { value: 3, label: "Vehicle to Grid" },
            ]}
            onChange={([before, after]) => {
              if (isScenarioId(before) && isScenarioId(after)) {
                setScenarioIds([before, after]);
              }
            }}
          />
        </Flex>
        <Flex align="center" gap="md" w="100%">
          <Text>Now you can jump between them:</Text>
          <SegmentedControl
            value={switcherValue}
            onChange={(value) => {
              if (value === "before" || value === "after") {
                setSwitcherValue(value);
              }
            }}
            data={switcherValues}
            className={styles.flex1}
          />
        </Flex>
      </Flex>
      <Await promise={subjectScenario} fallback={<LoadingBlock />}>
        {({ response }) => {
          const foo = nivoDailyLoadData(response, {
            includeStoresE: false,
            includeStoresP: false,
            excludeData: ["EV driving"],
          });

          return (
            <Card>
              <div className={styles.chartContainerLg}>
                <LineChart {...foo} />
              </div>
            </Card>
          );
        }}
      </Await>

      <Await promise={subjectScenario} fallback={<LoadingBlock />}>
        {({ response }) => {
          const dailyMarginalPriceData = nivoDailyMarginalPriceData(response, {
            includeBuses: ["Grid"],
          });
          return (
            <Card>
              <div className={styles.chartContainerLg}>
                <LineChart {...dailyMarginalPriceData} />
              </div>
            </Card>
          );
        }}
      </Await>
    </Flex>
  );
}
