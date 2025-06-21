import { Divider, Flex, ScrollArea, Tabs, Text, Title } from "@mantine/core";
import { ResponsiveContentProps } from "../types";
import styles from "./styles.module.css";

export function MobileContent({
  title,
  text,
  content,
}: ResponsiveContentProps) {
  return (
    <Flex
      direction="column"
      gap="md"
      justify="space-between"
      h="100%"
      p="sm"
      pt={0}
      style={{ overflow: "hidden" }}
      className={styles.root}
    >
      <div className={styles.card} style={{ flex: 1 }}>
        <Title order={3} pt="md">
          {title}
        </Title>
        <ScrollArea type="auto" pr="md">
          {text.map((t, ix) => (
            <p key={ix}>{t}</p>
          ))}
        </ScrollArea>
      </div>
      <Divider />
      <div className={styles.card}>
        <Tabs defaultValue={content[0]?.key} variant="pills">
          <Tabs.List>
            {content.map((c, ix) => (
              <Tabs.Tab key={ix} value={c.key}>
                <Text className={styles.tabTitle}>{c.title}</Text>
              </Tabs.Tab>
            ))}
          </Tabs.List>
          {content.map((c, ix) => (
            <Tabs.Panel key={ix} value={c.key}>
              <div style={{ height: 300, width: "100%" }}>{c.content}</div>
            </Tabs.Panel>
          ))}
        </Tabs>
      </div>
    </Flex>
  );
}
