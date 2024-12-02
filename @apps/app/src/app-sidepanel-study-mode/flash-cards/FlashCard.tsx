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

export type FlashCardAnimState =
  | "idle"
  | "flipping"
  | "flipEnded"
  | "fading"
  | "fadedOut";

export type FlashCardAction =
  | "learned"
  | "learn-later"
  | "flip"
  | (string & {});

type FlashCardProps = {
  onAction?: (action: FlashCardAction) => void;
  kind?: string;
  word?: string;
  examples?: Array<[string, string]>;
  image?: string;
  translation?: string;
  isLearned?: boolean;
  width?: number;
  height?: number;
  animState?: FlashCardAnimState;
  onAnimStateChange: (state: FlashCardAnimState) => void;
  actions?: string[];
};

const FadeOutDuration = 600;

const FlashCard: React.FC<FlashCardProps> = ({
  onAction,
  isLearned,
  examples,
  kind,
  word,
  image,
  translation,
  width,
  height,
  onAnimStateChange,
  actions,
  animState
}) => {
  const [visible, setVisible] = useState(false);

  const handleFlip = () => {
    onAnimStateChange("flipping");
  };

  useEffect(() => {
    // Show card with fade in animation after it's mounted
    setVisible(true);
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (animState === "flipping") {
      timeout = setTimeout(() => {
        onAnimStateChange?.("flipEnded");
      }, FadeOutDuration);
    } else if (animState === "fadedOut") {
      onAnimStateChange?.("idle");
    } else if (animState === "fading") {
      timeout = setTimeout(() => {
        onAnimStateChange?.("fadedOut");
      }, FadeOutDuration);
    }

    return () => clearTimeout(timeout);
  }, [animState]);

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

  const isFadingOut = animState === "fading";

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
      <div
        className={classNames(
          styles.flashcard,
          animState !== "idle",
          styles.flipped,
        )}
      >
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
                width: "100%",
              }}
            >
              {animState ? (
                <>
                  {actions?.map((action) => (
                    <Button
                      key={action}
                      disabled={isLearned}
                      mt="md"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onAction?.(action)
                      }}
                    >
                      {upperFirst(action)}
                    </Button>
                  ))}
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

const FlashCardExamples: React.FC<{
  examples?: Array<[string, string]>;
  showTranslation?: boolean;
}> = ({ examples, showTranslation }) => (
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
