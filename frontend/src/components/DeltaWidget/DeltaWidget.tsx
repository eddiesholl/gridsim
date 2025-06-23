import { Flex, Text, Title } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { useResponsiveMode } from "../../common/use-responsive-mode";
import { roundTo } from "../../data/tools";
import { DeltaPercent } from "../DeltaPercent";
import styles from "./styles.module.css";

type DeltaWidgetProps = {
  priceBefore: number;
  priceAfter: number;
  fullTitle: string;
  compactTitle: string;
};

export function DeltaWidget({
  priceBefore,
  priceAfter,
  fullTitle,
  compactTitle,
}: DeltaWidgetProps) {
  const isMobile = useResponsiveMode() === "mobile";

  return (
    <div className={styles.root}>
      <Title order={4}>{isMobile ? compactTitle : fullTitle}</Title>
      <Flex justify="center" align="center" gap="xs">
        <span>${roundTo(priceBefore, 0)}</span>
        <IconArrowRight size={16} />
        <span>${roundTo(priceAfter, 0)}</span>
      </Flex>
      <Text className={styles.summaryNumber}>
        <b>
          <DeltaPercent before={priceBefore} after={priceAfter} />
        </b>
      </Text>
    </div>
  );
}
