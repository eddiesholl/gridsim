import { Button, Flex } from "@mantine/core";
import { useLoaderData } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { objectEntries } from "../../../common/object";
import { useResponsiveMode } from "../../../common/use-responsive-mode";
import { LineChart } from "../../../components/LineChart";
import { ResponsiveContent } from "../../../components/ResponsiveContent";
import {
  nivoDailyLoadData,
  nivoDailyMarginalPriceData,
} from "../../../data/nivo";
import { Scenarios } from "../../../types";

const scenarios: Scenarios[] = [
  "intro",
  "evCharging",
  "smartCharging",
  "v2g",
] as const;

type ScenarioDetails = {
  label: string;
  title: string;
  description: string[];
};
const scenarioNavs: Record<Scenarios, ScenarioDetails> = {
  intro: {
    label: "Introduction",
    title: "Introduction to our electricity grid",
    description: [
      `The modern electricity grid has evolved from a fairly dull
                  system of fixed generation with little innovation, to a
                  dynamic and evolving system of variable generation. Cheap but
                  variable renewable energy, primarily from solar and wind, has
                  been slowly replacing the fixed generation of coal and gas.`,
      `Cheap solar is obviously most abundant in the middle of the day. Demand varies through the day, with the highest demand in
                  the afternoon and early evening. This means the grid is over
                  supplied with energy in the middle of the day, but stretched
                  for supply in the late afternoon and evening. Wholesale
                  electricity prices will normally be highest in this part of
                  the day, as we need to call on all possible generation
                  sources, especially the most expensive ones. This is where
                  storage and demand response come into play, they are the ideal
                  match to cheap renewables.`,
      `The grid you see modelled here is simplified, but is roughly
                  based on the National Electricity Market (NEM) in Australia.`,
    ],
  },
  evCharging: {
    label: "EV charging",
    title: "EV charging",
    description: [
      `First, we'll introduce a fleet of 200 electric vehicles (EVs) to our
          grid, each with an 80kWh battery. The daily recharge of the vehicles
          will increase the demand on the grid, once they have returned home
          after commuting. The fleet will start the day charged to 100%, and end
          the day at 100% again. To recharge after driving, they will simply
          start charging as soon as drivers return home and plug them in.
        `,
      `We can now see the total energy stored in the batteries of all 200 EVs
          in the chart, called 'Battery storage (MWh stored)'. We'll treat it as
          one large single battery. You can see the state drop during the
          morning and evening commute. Then when everyone plugs in when they get
          home, the cars just start charging straight away back to full.
        `,
      `This defines our worst case scenario, as we're adding demand right
          when the grid is least able to handle it. The marginal price is higher
          now, as we need to call on more expensive backup generation reserves.`,
    ],
  },
  smartCharging: {
    label: "Smart charging",
    title: "Smart charging",
    description: [
      `Obviously we don't want to increase demand when the grid is least able
          to handle it. Can we make a smarter choice about when we choose to
          recharge?`,
      `We'll give the EV and charger enough intelligence to choose when to
          recharge. Just make sure the battery is ready to go by 6am. The exact
          constraints could be based on an advanced dynamic signal using the
          real time wholesale electricity price, maybe part of a Virtual Power
          Plant (VPP). But it could also be as simple as a default charging time
          window. Many EVs have offered this feature for several years already.
          The goal is just to be recharged by midnight.`,
      `This is already a significant improvement, saving consumers and the
          grid as a whole significant amount of money, and investment needed in
          the grid to handle the demand.`,
    ],
  },
  v2g: {
    label: "Vehicle to Grid",
    title: "Vehicle to Grid",
    description: [
      `Large scale storage of electricity, connected to the grid, is ideal to
          help ease the strain on the grid at times where it is hardest to match
          supply to demand. Let's leverage the energy stored in the EV fleet to
          help out here. We will enrol a part of our EV fleet in a V2G program.
          As well as drawing power from the grid to recharge, they're now also
          able to return power to the grid.`,
      `By storing additional energy, then responding at critical times, we
          can ease the load on the grid even further. This means less capacity
          is needed from other sources just to cover the peak of each day,
          saving money and avoiding use of gas.`,
    ],
  },
};

export function ScenariosIntro() {
  const allScenarioData = useLoaderData({ from: "/scenarios/intro" });
  console.log({ allScenarioData });

  // const [currentScenario, setCurrentScenario] = useQueryState<Scenarios>(
  //   "scenario",
  //   parseAsStringLiteral(scenarios).withDefault(scenarios[0])
  // );
  // TODO: search param change is triggering a rerender
  const [currentScenario, setCurrentScenario] = useState<Scenarios>(
    scenarios[0]
  );

  const currentScenarioDetails = scenarioNavs[currentScenario];
  const scenarioData = allScenarioData[currentScenario];

  const responsiveMode = useResponsiveMode();

  const dailyLoadData = nivoDailyLoadData(scenarioData.response, {
    includeStoresE: false,
    includeStoresP: false,
    excludeData: ["EV driving"],
    responsiveMode,
  });

  const dailyMarginalPriceData = nivoDailyMarginalPriceData(
    scenarioData.response,
    {
      includeBuses: ["Grid"],
      responsiveMode,
    }
  );

  const content = useMemo(
    () => [
      {
        key: "dailyLoadData",
        title: "Daily load",
        content: <LineChart {...dailyLoadData} />,
      },
      {
        key: "dailyMarginalPriceData",
        title: "Marginal price",
        content: <LineChart {...dailyMarginalPriceData} />,
      },
    ],
    [dailyLoadData, dailyMarginalPriceData]
  );

  return (
    <Flex direction="column" gap="md" h="100%">
      <Flex direction="row" justify="flex-end" gap="md" h="60px" p="md">
        {objectEntries(scenarioNavs).map(([key, details]) => (
          <Button
            key={key}
            variant={key === currentScenario ? "filled" : "default"}
            onClick={() => setCurrentScenario(key)}
          >
            {details.label}
          </Button>
          // <div key={key}>
          //   <MTLink className={styles.navItem} to={item.path}>
          //     {item.label}
          //   </MTLink>
          // </div>
        ))}
      </Flex>
      {/* <div className={styles.scrollArea}> */}
      <ResponsiveContent
        title={currentScenarioDetails.title}
        text={currentScenarioDetails.description}
        content={content}
      />
      {/* </div> */}
    </Flex>
  );
}
