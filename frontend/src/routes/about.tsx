import { Card, Flex, Title } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { PageWrapper } from "../components";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <PageWrapper>
      <Flex direction="column" gap="md">
        <Card>
          <Title order={3}>What is GridSim?</Title>
          <p>
            For the last century or so, the electricity grid has been busy
            quietly helping to power comfortable modern lives. A somewhat
            thankless task, and without much in the way of excitement. The 21st
            century has changed all of that, and it's now a hotbed of innovation
            and technology. After decades of quiet service, it's now being asked
            to rapidly adapt, and unlock exciting potential energy pathways.
          </p>
          <p>
            GridSim is a personal project to help explore the potential of the
            electricity grid, to study how it can be a more efficient, reliable,
            and sustainable system. I'm keen to learn more about the potential
            impact of Vehicle to Grid, load shifting, virtual power plants, and
            other emerging technologies.
          </p>
        </Card>
        <Card>
          <Title order={3}>How does it work?</Title>
          <p>
            The simulation component is powered by{" "}
            <a href="https://pypsa.org/">PyPSA</a>, a powerful open source tool
            for simulating an electricity grid.
          </p>
          <p>
            The project is just in it's early stages. You can see some of the
            upcoming plans at the{" "}
            <a href="https://github.com/users/eddiesholl/projects/2/views/1">
              GitHub project board
            </a>
            .
          </p>
        </Card>
        <Card>
          <Title order={3}>Who is building this?</Title>
          <p>
            Me! My name is Eddie Sholl, I'm an experienced software engineer
            with a keen interest in the intersection of technology and
            sustainability. You can find me on{" "}
            <a href="https://www.linkedin.com/in/eddie-sholl/">LinkedIn</a>
            ,&nbsp;
            <a href="https://github.com/eddie-sholl">GitHub</a>, or&nbsp;
            <a href="https://hachyderm.io/@eddie_sholl">Mastodon</a>.
          </p>
        </Card>
      </Flex>
    </PageWrapper>
  );
}
