import { Button, Card, Flex, Space, Text, Title } from "@mantine/core";
import { PageWrapper } from "../../components";
import { MTLink } from "../../components/Link";
import styles from "./page.module.css";

export function IndexPage() {
  return (
    <PageWrapper className={styles.page}>
      <Flex
        direction="column"
        gap="md"
        justify="center"
        align="center"
        w="100%"
      >
        <Card mt="xl" className={styles.introBanner}>
          <Title order={1}>Welcome to GridSim</Title>
          <Text className={styles.subtitle}>
            Your favourite new tool to help explore the future of the power grid
          </Text>
          <Space h="md" />
          <Text fw="500">
            GridSim is an open source tool that uses simulation to help you
            understand the concepts and terminology relevant to the modern power
            grid. If you've heard terms like "virtual power plant" or "vehicle
            to grid" and wondered what they mean, this is the place to start.
          </Text>
          <Space h="md" />
          <Flex gap="md">
            <MTLink to="/scenarios" className={styles.primaryButton}>
              Get started
            </MTLink>
            <Button
              className={styles.secondaryButton}
              component="a"
              href="https://github.com/eddiesholl/gridsim"
              target="_blank"
            >
              View on GitHub
            </Button>
          </Flex>
          <Space h="md" />

          <Text fw="500">
            Powered by <a href="https://pypsa.org/">PyPSA</a>
          </Text>
        </Card>
      </Flex>
    </PageWrapper>
  );
}
