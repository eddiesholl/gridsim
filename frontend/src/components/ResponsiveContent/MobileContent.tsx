import { Flex, Title } from "@mantine/core";
import { ResponsiveContentProps } from "./types";

export function MobileContent({
  title,
  text,
  content,
}: ResponsiveContentProps) {
  return (
    <Flex direction="column" gap="sm">
      <Title order={2}>{`${title} - mobile`}</Title>
      {text.map((t, ix) => (
        <p key={ix}>{t}</p>
      ))}
      {content.map((c, ix) => (
        <div key={ix}>{c.content}</div>
      ))}
    </Flex>
  );
}
