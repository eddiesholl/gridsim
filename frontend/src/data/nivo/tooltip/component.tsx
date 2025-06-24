import { Flex } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { LineSeries, PointTooltipProps } from "@nivo/line";
import styles from "./styles.module.css";

const formatDate = (date: Date) => {
  return date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
  });
};

export const NivoTooltip = (event: PointTooltipProps<LineSeries>) => {
  const { width } = useViewportSize();

  const t = event.point.data.x as Date;
  const v = event.point.data.y as number;
  const series = event.point.seriesId;
  const x = event.point.x;
  const xTranslate = x < 50 ? 50 : x + 120 > width ? -(x + 120 - width) : 0;
  const yTranslate = 0;

  return (
    <Flex
      align={"center"}
      className={styles.wrapper}
      style={{
        transform: `translate(${xTranslate}px, ${yTranslate}px)`,
      }}
    >
      <span>{`${series} at ${formatDate(t)}: ${v}`}</span>
    </Flex>
  );
};
