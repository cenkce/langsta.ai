import { Card, rem, Group, Flex, Title, Menu, ActionIcon, Text } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { IconDots, IconPlus, IconTrash } from "@tabler/icons-react";

type WordDescriptor = { translation: string; kind: string; examples: string[]; };
export type WordCollection = { [key: string]: WordDescriptor; };

export function WordCard({
  word, descriptor,
}: {
  word: string;
  descriptor: WordDescriptor;
}) {
  return (
    <Card
      style={{ gap: "1rem" }}
      w={rem(280)}
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
    >
      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="space-between">
          <Flex direction="column">
            <Title size={"h6"}>
              {upperFirst(word)} ({descriptor.kind}){" "}
            </Title>
            <Text size="xs">{upperFirst(descriptor.translation)}</Text>
          </Flex>
          <Menu withinPortal position="bottom-end" shadow="sm">
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconDots style={{ width: rem(16), height: rem(16) }} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconPlus style={{ width: rem(14), height: rem(14) }} />}
              >
                Save
              </Menu.Item>
              <Menu.Item
                disabled
                leftSection={<IconPlus style={{ width: rem(14), height: rem(14) }} />}
              >
                More
              </Menu.Item>
              <Menu.Item
                leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                color="red"
              >
                Remove
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Card.Section>
      <Flex
        direction={"column"}
        justify="flex-start"
        align="flex-start"
        gap={rem(5)}
      >
        <Text fz={"sm"} fw={"bold"} c="dimmed">
          Examples
        </Text>
        {descriptor?.examples?.map((example, i) => (
          <Text fz={"sm"} key={i}>
            {i % 2 === 1 ? <i>{example}</i> : example}
          </Text>
        ))}
      </Flex>
    </Card>
  );
}
