import { Flex } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { LineSeries, PointTooltipProps } from "@nivo/line";

const formatDate = (date: Date) => {
  return date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
  });
};

export const NivoTooltip = (event: PointTooltipProps<LineSeries>) => {
  const { width } = useViewportSize();

  console.log(event);
  const t = event.point.data.x as Date;
  const v = event.point.data.y as number;
  const series = event.point.seriesId;
  const x = event.point.x;
  const xTranslate = x < 50 ? 50 : x + 120 > width ? -(x + 120 - width) : 0;
  const yTranslate = 0;

  return (
    <Flex
      align={"center"}
      style={{
        fontSize: 12,
        backgroundColor: "var(--mantine-color-tan-1)",
        borderRadius: 2,
        border: "1px solid var(--mantine-color-tan-6)",
        width: 150,
        padding: 4,
        transform: `translate(${xTranslate}px, ${yTranslate}px)`,
      }}
    >
      <span>{`${series} at ${formatDate(t)}: ${v}`}</span>
    </Flex>
  );
};
