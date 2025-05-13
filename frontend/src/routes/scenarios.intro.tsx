import { Card, Flex, Text, Title } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/scenarios/intro")({
  component: ScenariosIntro,
});

function ScenariosIntro() {
  return (
    <Flex direction="column" gap="md">
      <Card>
        <Title order={2}>Scenarios Introduction</Title>
        <Text>
          <p>
            Welcome to the scenarios section. Here you can explore different
            energy scenarios and their impact on the grid.
          </p>
        </Text>
      </Card>
    </Flex>
  );
}
