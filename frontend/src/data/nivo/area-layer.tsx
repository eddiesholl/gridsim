import { Defs } from "@nivo/core";
import { area } from "d3-shape";
// import { ResponsiveLine } from "@nivo/line";

type AreaLayerOuterProps = {
  startHour: string; // e.g., "2016-01-01 15:00:00"
  endHour: string; // e.g., "2016-01-01 20:00:00"
};

type AreaLayerInnerProps = {
  xScale: (value: Date) => number;
  yScale: (value: number) => number;
  innerHeight: number;
  innerWidth: number;
};

export const AreaLayer =
  ({ startHour, endHour }: AreaLayerOuterProps) =>
  ({ xScale, innerHeight }: AreaLayerInnerProps) => {
    // Create a simple data array for the area generator
    // We only need two points to create a vertical stripe
    const areaData = [
      { x: new Date(startHour), y: 0 },
      { x: new Date(endHour), y: 0 },
    ];

    const areaGenerator = area<{ x: Date; y: number }>()
      .x0((d) => xScale(d.x))
      .x1((d) => xScale(d.x))
      .y0(() => 0)
      .y1(() => innerHeight);

    const pathData = areaGenerator(areaData);
    console.log({ pathData });

    return (
      <>
        <Defs
          defs={[
            {
              id: "pattern",
              type: "patternLines",
              background: "transparent",
              color: "#3daff7",
              lineWidth: 1,
              spacing: 6,
              rotation: -45,
            },
          ]}
        />
        <path
          d={pathData || ""}
          fill="#aaaaff"
          fillOpacity={0.6}
          stroke="#3daff7"
          strokeWidth={2}
        />
      </>
    );
  };
