import { Flex, ScrollArea, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { OptionSelector } from "../../OptionSelector";
import { ResponsiveContentProps } from "../types";
import styles from "./styles.module.css";

export function MobileContent({
  title,
  text,
  content,
}: ResponsiveContentProps) {
  const [selectedContentKey, setSelectedContentKey] = useState<string>(
    content[0]?.key
  );
  const selectedContent = content.find((c) => c.key === selectedContentKey);

  useEffect(() => {
    if (selectedContent === undefined) {
      setSelectedContentKey(content[0]?.key);
    }
  }, [selectedContent, content]);

  return (
    <Flex
      direction="column"
      justify="space-between"
      h="100%"
      className={styles.root}
    >
      <div className={styles.topSection}>
        <Title order={3}>{title}</Title>
        <ScrollArea type="auto" pr="md">
          {text.map((t, ix) => (
            <p key={ix}>{t}</p>
          ))}
        </ScrollArea>
      </div>
      <div className={styles.card}>
        <OptionSelector
          options={content.map((c) => ({
            label: c.title,
            labelCompact: c.title,
            value: c.key,
          }))}
          value={selectedContentKey}
          onChange={setSelectedContentKey}
          color="moonstone.6"
        />

        <div className={styles.chartContainerSm}>
          {selectedContent?.content}
        </div>
      </div>
    </Flex>
  );
}
