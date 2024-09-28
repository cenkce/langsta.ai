import React from "react";
import {
  Card,
  Image,
  Text,
  Title,
  List,
  Button,
  ThemeIcon,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import styles from "./FlashCard.module.css";

type Example = {
  example: string;
  translation: string;
};

type FlashCardProps = {
  word: string;
  translation: string;
  description?: string;
  image?: string;
  examples: Example[];
  onRemove: () => void;
  isFadingOut: boolean;
  index: number;
};

const FlashCard: React.FC<FlashCardProps> = ({
  word,
  translation,
  description,
  image,
  examples,
  index,
  onRemove,
  isFadingOut,
}) => (
  <Card
    shadow="sm"
    padding="lg"
    className={`${styles.flashcard} ${isFadingOut ? styles.fadeOut : ""}`}
    style={{ left: `${index * 10}px`, top: `${index * 10}px` }}
  >
    {image ? (
      <Card.Section>
        <Image src={image} alt={word} height={160} />
      </Card.Section>
    ) : null}
    <Title order={3} mt="md">
      {word}
    </Title>
    <Text c="dimmed" size="sm">
      {translation}
    </Text>
    <Text mt="md">{description}</Text>
    <List
      mt="md"
      spacing="xs"
      size="sm"
      center
      icon={
        <ThemeIcon color="teal" size={24} radius="xl">
          <IconCheck size={16} />
        </ThemeIcon>
      }
    >
      {examples.map((example, index) => (
        <List.Item key={index}>
          <Text>{example.example}</Text>
          <Text color="dimmed" size="xs">
            {example.translation}
          </Text>
        </List.Item>
      ))}
    </List>
    <Button mt="md" onClick={onRemove}>
      Learned
    </Button>
    <Button mt="md" ml="sm" onClick={onRemove}>
      Learn Later
    </Button>
  </Card>
);

export default FlashCard;
