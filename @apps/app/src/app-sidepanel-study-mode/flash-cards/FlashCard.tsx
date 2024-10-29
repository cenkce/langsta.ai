import React, { useState } from "react";
import {
  Card,
  Image,
  Text,
  Title,
  List,
  Button,
  ThemeIcon,
  Stack,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { classNames } from "@espoojs/utils";
import styles from "./FlashCard.module.css";

export type FlashCardAction = "learned" | "learn-later";

type FlashCardProps = {
  index: number;
  onAction?: (action: FlashCardAction) => void;
  isFadingOut: boolean;
  kind?: string;
  word?: string;
  examples?: Array<Array<string>>;
  image?: string;
  translation?: string;
};

const FlashCard: React.FC<FlashCardProps> = ({
  index,
  onAction,
  isFadingOut,
  examples,
  kind,
  word,
  image,
  translation,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className={classNames(
        styles.flashcardContainer,
        isFadingOut,
        styles.fadeOut,
      )}
      style={{ left: `${index * 10}px`, top: `${index * 10}px` }}
      onClick={handleFlip}
    >
      <div className={classNames(styles.flashcard, isFlipped, styles.flipped)}>
        <div className={styles.front}>
          <Card shadow="sm" padding="lg">
            {image ? (
              <Card.Section>
                <Image src={image} alt={word} height={160} />
              </Card.Section>
            ) : null}
            <Title order={3} mt="md">
              {word}
            </Title>
            <Text c="dimmed" size="sm">
              {kind}
            </Text>
            {/* <Text mt="md">{description}</Text> */}
          </Card>
        </div>
        <div className={styles.back}>
          <Card shadow="sm" padding="lg">
            <Title order={3} mt="md">
              {translation}
            </Title>
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
              {examples?.map(([example, translation], index) => (
                <List.Item key={index}>
                  <Text size="sm">{example}</Text>
                  <Text color="dimmed" size="xs">
                    {translation}
                  </Text>
                </List.Item>
              ))}
            </List>
            <Stack style={{ flexDirection: "row" }}>
              <Button mt="md" onClick={() => onAction?.("learned")}>
                Learned
              </Button>
              <Button mt="md" onClick={() => onAction?.("learn-later")}>
                Learn Later
              </Button>
            </Stack>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FlashCard;
