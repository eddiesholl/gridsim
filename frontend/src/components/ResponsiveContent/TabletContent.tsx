import { Card, Flex, Tabs, Text, Title } from "@mantine/core";
import styles from "./styles.module.css";
import { ResponsiveContentProps } from "./types";

export function TabletContent({
  title,
  text,
  content,
}: ResponsiveContentProps) {
  return (
    <Flex
      direction="column"
      gap="sm"
      justify="space-between"
      h="100%"
      p="sm"
      pt={0}
    >
      <Card style={{ flex: 1 }}>
        <Title order={2}>{`${title} - tablet`}</Title>
        {text.map((t, ix) => (
          <p key={ix}>{t}</p>
        ))}
      </Card>
      <Card>
        <Tabs defaultValue={content[0]?.key} variant="outline">
          <Tabs.List>
            {content.map((c, ix) => (
              <Tabs.Tab key={ix} value={c.key}>
                <Text className={styles.tabTitle}>{c.title}</Text>
              </Tabs.Tab>
            ))}
          </Tabs.List>
          {content.map((c, ix) => (
            <Tabs.Panel key={ix} value={c.key}>
              <div style={{ height: 450, width: "100%" }}>{c.content}</div>
            </Tabs.Panel>
          ))}
        </Tabs>
      </Card>
    </Flex>
  );
}
