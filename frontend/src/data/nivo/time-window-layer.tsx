import { Defs } from "@nivo/core";
import { area } from "d3-shape";
import { darkenColor } from "../../common/colors";
// import { ResponsiveLine } from "@nivo/line";

type TimeWindow = {
  startHour: string; // e.g., "2016-01-01 15:00:00"
  endHour: string; // e.g., "2016-01-01 20:00:00"
  fillColor?: string;
  text?: string;
};

type TimeWindowLayerOuterProps = {
  timeWindows: TimeWindow[];
};

type TimeWindowLayerInnerProps = {
  xScale: (value: Date) => number;
  yScale: (value: number) => number;
  innerHeight: number;
  innerWidth: number;
};

export const TimeWindowLayer =
  ({ timeWindows }: TimeWindowLayerOuterProps) =>
  ({ xScale, innerHeight }: TimeWindowLayerInnerProps) => {
    const areaGenerator = area<{ x: Date; y: number }>()
      .x0((d) => xScale(d.x))
      .x1((d) => xScale(d.x))
      .y0(() => 0)
      .y1(() => innerHeight);

    const windows = timeWindows.map(
      ({ startHour, endHour, fillColor, text }) => {
        const areaData = [
          { x: new Date(startHour), y: 0 },
          { x: new Date(endHour), y: 0 },
        ];
        const fill = fillColor || "#ffa3a3";
        const stroke = darkenColor(fill, 0.1);
        const textX = Math.max(0, xScale(new Date(startHour)));
        const textY = -5;
        return {
          path: areaGenerator(areaData),
          fill,
          stroke,
          textX,
          textY,
          text,
        };
      }
    );

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
        {windows.map(({ path, fill, textX, textY, text }, ix) => (
          <>
            <path
              key={ix}
              d={path || ""}
              fill={fill}
              fillOpacity={0.2}
              stroke={fill}
              strokeWidth={2}
              strokeOpacity={0.4}
            />
            {text && (
              <text x={textX} y={textY} textAnchor="left" fontSize={10}>
                {text}
              </text>
            )}
          </>
        ))}
      </>
    );
  };
