import { Card, Flex, Text, Title } from "@mantine/core";

export function ScenariosV2H() {
  return (
    <Flex direction="column" gap="md">
      <Card>
        <Title order={2}>Vehicle to home (V2H)</Title>
        <Text>
          <p>
            If we want to see further benefits, we'll need to start letting our
            EVs Let's start using the storage we have available to satisfy some
            of the grid demand
          </p>
          <p>
            Most passenger vehicles are only in use a small percentage of the
            day. As our ground transport fleet transitions to electric vehicles
            (EVs), we will have a lot of batteries sitting idle when parked and
            not in use. Vehicle to Grid (V2G) is a technology that allows our
            EVs to store energy from the grid and discharge it back to the grid
            when needed. This technology is still in the early stages of
            development, but it has the potential to revolutionize the way we
            use electricity. The capacity of the EV fleet is an immensely
            valuable asset to the rest of our grid.
          </p>
        </Text>
      </Card>
    </Flex>
  );
}
