import { Card, Flex, Title } from "@mantine/core";
import { PageWrapper } from "../../PageWrapper";
import { ResponsiveContentProps } from "../types";
import styles from "./styles.module.css";

export function DesktopContent({
  title,
  text,
  content,
}: ResponsiveContentProps) {
  return (
    <PageWrapper>
      <Flex direction="column" gap="lg" pt={0}>
        <Card className={styles.text}>
          <Title order={2}>{`${title} - desktop`}</Title>
          {text.map((t, ix) => (
            <p key={ix}>{t}</p>
          ))}
        </Card>
        <Flex direction="column" gap="lg">
          {content.map((c) => (
            <Card key={c.key}>{c.content}</Card>
          ))}
        </Flex>
      </Flex>
    </PageWrapper>
  );
}
