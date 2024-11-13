import React, { useState, useMemo } from "react";
import { CrosswordLayout, generateLayout } from "crossword-layout-generator";
import styles from "./Crosswords.module.css";
import { Center, Flex, List, Title } from "@mantine/core";
import { classNames } from "@espoojs/utils";
import { upperFirst } from "@mantine/hooks";

export interface WordEntry {
  id?: number;
  answer: string;
  clue: string;
}

const App: React.FC<{ words: WordEntry[] }> = ({ words }) => {
  const layout = useMemo(
    () =>
      words.length > 0
        ? generateLayout(words)
        : ({
            table: [],
            cols: 0,
            rows: 0,
            result: [],
          } as ReturnType<typeof generateLayout>),
    [words],
  );

  return (
    <div className="app">
      <Title>Crossword Puzzle</Title>
      <div className="crossword-container">
        <CrosswordGrid layout={layout} />
      </div>
    </div>
  );
};

// CrosswordGrid Component
const CrosswordGrid: React.FC<{
  layout: CrosswordLayout;
  onCellChange?: (row: number, col: number, value: string) => void;
}> = ({ layout }) => {
  const [userInputs, setUserInputs] = useState<Map<string, string>>(new Map());
  const [highlightedClue, setHighlightedClue] = useState<string[] | undefined>(
    [],
  );

  const getClueByPosition = (x: number, y: number) => {
    return layout.result
      .filter((res) => {
        if (res.orientation === "across") {
          return (
            res.startx <= x &&
            res.starty === y &&
            res.startx + res.answer.length > x
          );
        } else {
          return (
            res.startx === x &&
            res.starty <= y &&
            res.starty + res.answer.length > y
          );
        }
      })
      .map(({ clue }) => clue);
  };

  const matchUserInputsWithAnswerByPosition = () => {
    const matchedAnswers = new Map<string, boolean>();
    layout.result.forEach(({ startx, starty, answer, orientation }) => {
      let isFullyMatched = true;
      for (let i = 0; i < answer.length; i++) {
        const key =
          orientation === "across"
            ? `${starty - 1}-${startx - 1 + i}`
            : `${starty - 1 + i}-${startx - 1}`;
        const userInput = userInputs.get(key)?.toUpperCase() || "";
        if (userInput !== answer[i].toUpperCase()) {
          isFullyMatched = false;
          break;
        }
      }
      if (isFullyMatched) {
        for (let i = 0; i < answer.length; i++) {
          const key =
            orientation === "across"
              ? `${starty - 1}-${startx - 1 + i}`
              : `${starty - 1 + i}-${startx - 1}`;
          matchedAnswers.set(key, true);
        }
      }
    });
    return matchedAnswers;
  };

  return (
    <Flex
      className={styles["crossword-grid"]}
      direction={"row"}
      columnGap={"md"}
    >
      <Flex gap={1} direction={'column'}>
        {layout.table.map((row, rowIndex) => (
          <div className={styles["crossword-row"]} key={rowIndex}>
            {row.map((cell, colIndex) => (
              <div
                className={classNames(
                  styles["crossword-cell"],
                  cell === "-",
                  styles.block,
                )}
                key={colIndex}
              >
                {cell !== "-" &&
                  (matchUserInputsWithAnswerByPosition().get(
                    `${rowIndex}-${colIndex}`,
                  ) ? (
                    <Center
                      onMouseOver={() =>
                        setHighlightedClue(
                          getClueByPosition(colIndex + 1, rowIndex + 1),
                        )
                      }
                      onMouseOut={() => setHighlightedClue([])}
                    >
                      {userInputs
                        .get(`${rowIndex}-${colIndex}`)
                        ?.toUpperCase() || ""}
                    </Center>
                  ) : (
                    <input
                      type="text"
                      maxLength={1}
                      value={
                        userInputs
                          .get(`${rowIndex}-${colIndex}`)
                          ?.toUpperCase() || ""
                      }
                      onMouseOver={() =>
                        setHighlightedClue(
                          getClueByPosition(colIndex + 1, rowIndex + 1),
                        )
                      }
                      onMouseOut={() => setHighlightedClue([])}
                      onChange={(e) => {
                        setUserInputs((ansers) => {
                          const newAnswers = new Map(ansers);
                          newAnswers.set(
                            `${rowIndex}-${colIndex}`,
                            e.target.value,
                          );
                          return newAnswers;
                        });
                      }}
                    />
                  ))}
              </div>
            ))}
          </div>
        ))}
      </Flex>
      <Flex direction={"column"}>
        <List type="ordered">
          {layout.result.map(({ clue }) => (
            <List.Item
              onMouseOver={() => setHighlightedClue([clue])}
              onMouseOut={() => setHighlightedClue([])}
              style={{ cursor: "pointer" }}
              key={clue}
              data-clue={clue}
              className={classNames(
                highlightedClue?.includes(clue),
                styles.highlighted,
              )}
            >
              {upperFirst(clue)}
            </List.Item>
          ))}
        </List>
      </Flex>
    </Flex>
  );
};

export default App;
