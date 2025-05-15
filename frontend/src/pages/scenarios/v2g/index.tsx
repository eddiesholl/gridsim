import { Card, Flex, Text, Title } from "@mantine/core";

export function ScenariosV2G() {
  return (
    <Flex direction="column" gap="md">
      <Card>
        <Title order={2}>What is Vehicle to Grid?</Title>
        <Text>
          <p>
            As an electricity grid transitions from fixed generation to cheap
            but variable renewables, it becomes a challenge to balance supply
            and demand. The ability to store energy is one technique to help
            meet this challenge. Grid scale storage, where dedicated batteries
            are commissioned and attached directly to the grid is something that
            is already happening, but all of those batteries are expensive.
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
