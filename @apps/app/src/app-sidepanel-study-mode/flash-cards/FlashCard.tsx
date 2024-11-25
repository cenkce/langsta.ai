import React, { useEffect, useState } from "react";
import {
  Card,
  Image,
  Text,
  List,
  Button,
  ThemeIcon,
  Stack,
  Center,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { classNames } from "@espoojs/utils";
import styles from "./FlashCard.module.css";
import { upperFirst } from "@mantine/hooks";
import { FlexRow } from "../../ui/FlexRow";

export type FlashCardAction = "learned" | "learn-later" | "flip";

type FlashCardProps = {
  onAction?: (action: FlashCardAction) => void;
  isFadingOut: boolean;
  kind?: string;
  word?: string;
  examples?: Array<[string, string]>;
  image?: string;
  translation?: string;
  isLearned?: boolean;
  width?: number;
  height?: number;
  onFadeOutEnd?: () => void;
  onFlipped?: () => void;
};

const FlashCard: React.FC<FlashCardProps> = ({
  onAction,
  isFadingOut,
  isLearned,
  examples,
  kind,
  word,
  image,
  translation,
  width,
  height,
  onFadeOutEnd,
  onFlipped,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleFlip = () => {
    if (!isFlipped) {
      setTimeout(() => {
        setIsFlipped(false);
        onFlipped?.();
      }, 1000);
    }
    setIsFlipped(true);
    onAction?.("flip");
  };

  useEffect(() => {
    // Show card with fade in animation after it's mounted
    setVisible(true);
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isFadingOut) {
      timeout = setTimeout(() => {
        onFadeOutEnd?.();
      }, 600);
    }

    return () => clearTimeout(timeout);
  }, [isFadingOut]);

  const wordElement = (
    <Center>
      <FlexRow>
        <Text fw={600} size="lg">
          {upperFirst(word || "")}
        </Text>
        <Text c="dimmed" size="sm">
          {upperFirst(kind || "")}
        </Text>
      </FlexRow>
    </Center>
  );

  return (
    <div
      className={classNames(
        styles.flashcardContainer,
        isFadingOut,
        styles.fadeOut,
        visible && !isFadingOut,
        styles.fadeIn,
      )}
      style={{ width, height }}
      onClick={handleFlip}
    >
      <div className={classNames(styles.flashcard, isFlipped, styles.flipped)}>
        <div className={styles.front}>
          <Card shadow="sm" padding="lg" style={{ width, height }}>
            {image ? (
              <Card.Section>
                <Image src={image} alt={word} height={160} />
              </Card.Section>
            ) : null}
            {wordElement}
            <FlashCardExamples showTranslation={false} examples={examples} />
          </Card>
        </div>
        <div className={styles.back}>
          <Card
            shadow="sm"
            padding="lg"
            style={{ width, height, position: "relative" }}
          >
            {wordElement}
            <Center>
              <Text size="md" mt="md">
                {upperFirst(translation || "")}
              </Text>
            </Center>
            <FlashCardExamples examples={examples} />
            <Stack
              style={{
                flexDirection: "row",
                position: "absolute",
                bottom: 20,
                justifyContent: "center",
                width: "100%"
              }}
            >
              {isFlipped ? (
                <>
                  <Button
                    disabled={isLearned}
                    mt="md"
                    onClick={() => onAction?.("learned")}
                  >
                    Learned
                  </Button>
                  <Button
                    disabled={isLearned}
                    mt="md"
                    onClick={() => onAction?.("learn-later")}
                  >
                    Study more
                  </Button>{" "}
                </>
              ) : (
                <Button mt="md" onClick={handleFlip}>
                  Flip
                </Button>
              )}
            </Stack>
          </Card>
        </div>
      </div>
    </div>
  );
};

const FlashCardExamples: React.FC<{ examples?: Array<[string, string]>, showTranslation?: boolean }> = ({ examples, showTranslation }) => (
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
          {showTranslation !== false ? translation : ""}
        </Text>
      </List.Item>
    ))}
  </List>
);

export default FlashCard;
