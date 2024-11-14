import React, { useState, useMemo } from "react";
import { CrosswordLayout, generateLayout } from "crossword-layout-generator";
import styles from "./Crosswords.module.css";
import { Center, Flex, List, Title } from "@mantine/core";
import { classNames } from "@espoojs/utils";
import { upperFirst, useSetState } from "@mantine/hooks";

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
  const [highlightedClue, setHighlightedClue] = useSetState<{
    focused: string[] | undefined;
    hovered: string[] | undefined;
  }>({ focused: [], hovered: [] });

  const getClueByPosition = (x: number, y: number) => {
    return layout.result.filter((res) => {
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
    });
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

  const lastSelectedWordRef = React.useRef<string | null>(null);

  const findAndFocusNextCell = ({
    rowIndex,
    colIndex,
    direction,
    recursive,
    backspace,
  }: {
    rowIndex: number;
    colIndex: number;
    direction?: number;
    backspace?: boolean;
    recursive?: boolean;
  }) => {
    const focusedCell = document.getElementById(
      `${colIndex}-${rowIndex}`,
    ) as HTMLInputElement;
    if (
      focusedCell &&
      (focusedCell.value ||
        (!focusedCell.value && (backspace || recursive)) ||
        direction !== undefined)
    ) {
      const factor =
        direction !== undefined
          ? direction
          : backspace && !focusedCell.value
            ? -1
            : 1;

      const result = getClueByPosition(colIndex + 1, rowIndex + 1).find(
        (item) =>
          lastSelectedWordRef.current
            ? lastSelectedWordRef.current === item?.answer
            : true,
      );

      lastSelectedWordRef.current = result?.answer || null;

      if (result) {
        const { startx, starty, orientation } = result;
        let nextCol: number | null = null;
        let nextRow: number | null = null;
        if (
          orientation === "across" &&
          colIndex < startx + result.answer.length - 1
        ) {
          nextCol = colIndex + factor;
          nextRow = rowIndex;
        } else if (
          orientation === "down" &&
          rowIndex < starty + result.answer.length - 1
        ) {
          nextCol = colIndex;
          nextRow = rowIndex + factor;
        }

        if (focusedCell && nextCol !== null && nextRow !== null) {
          const nextCellElement = document.getElementById(
            `${nextCol}-${nextRow}`,
          );
          if (nextCellElement?.tagName !== "INPUT") {
            // find next proper cell
            findAndFocusNextCell({
              rowIndex: nextRow,
              colIndex: nextCol,
              backspace,
              direction: direction,
              recursive: true,
            });
          } else if (nextCellElement) {
            nextCellElement?.focus();
          }
        }
      }
    }
  };

  return (
    <Flex
      className={styles["crossword-grid"]}
      direction={"row"}
      columnGap={"md"}
    >
      <Flex gap={1} direction={"column"}>
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
                        setHighlightedClue({
                          hovered: getClueByPosition(
                            colIndex + 1,
                            rowIndex + 1,
                          ).map(({ clue }) => clue),
                        })
                      }
                      id={`${colIndex}-${rowIndex}`}
                      onMouseOut={() => setHighlightedClue({ hovered: [] })}
                    >
                      {userInputs
                        .get(`${rowIndex}-${colIndex}`)
                        ?.toUpperCase() || ""}
                    </Center>
                  ) : (
                    <input
                      type="text"
                      maxLength={1}
                      data-cell={`cell-${colIndex}-${rowIndex}`}
                      id={`${colIndex}-${rowIndex}`}
                      value={
                        userInputs
                          .get(`${rowIndex}-${colIndex}`)
                          ?.toUpperCase() || ""
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Backspace") {
                          if (!e.currentTarget.value)
                            // focus on previous cell
                            findAndFocusNextCell({
                              rowIndex,
                              colIndex,
                              backspace: true,
                            });
                          else {
                            setUserInputs((answers) => {
                              const newAnswers = new Map(answers);
                              newAnswers.set(`${rowIndex}-${colIndex}`, "");
                              return newAnswers;
                            });
                          }
                        } else if (e.key === "ArrowRight") {
                          findAndFocusNextCell({
                            rowIndex,
                            colIndex,
                            direction: 1,
                          });
                        } else if (e.key === "ArrowLeft") {
                          findAndFocusNextCell({
                            rowIndex,
                            colIndex,
                            direction: -1,
                          });
                        } else if (/^[a-zA-Z]$/.test(e.key)) {
                          e.currentTarget.value = e.key.toUpperCase();
                          findAndFocusNextCell({ rowIndex, colIndex });
                          setUserInputs((answers) => {
                            const newAnswers = new Map(answers);
                            newAnswers.set(`${rowIndex}-${colIndex}`, e.key);
                            return newAnswers;
                          });
                        }
                      }}
                      onFocus={() =>
                        setHighlightedClue({
                          focused: getClueByPosition(
                            colIndex + 1,
                            rowIndex + 1,
                          ).map(({ clue }) => clue),
                        })
                      }
                      onBlur={() => setHighlightedClue({ focused: [] })}
                      onMouseOver={() => {
                        setHighlightedClue({
                          hovered: getClueByPosition(
                            colIndex + 1,
                            rowIndex + 1,
                          ).map(({ clue }) => clue),
                        });
                      }}
                      onMouseOut={() => {
                        setHighlightedClue({ hovered: [] });
                      }}
                    />
                  ))}
              </div>
            ))}
          </div>
        ))}
      </Flex>
      <Flex direction={"column"}>
        <List type="ordered" className={styles["clues-list"]}>
          {layout.result.map(({ clue }) => (
            <List.Item
              onMouseOver={() => setHighlightedClue({ hovered: [clue] })}
              onMouseOut={() => setHighlightedClue({ hovered: [] })}
              style={{ cursor: "pointer" }}
              key={clue}
              data-clue={clue}
              className={classNames(
                highlightedClue?.hovered?.includes(clue),
                styles.highlighted,
                highlightedClue?.focused?.includes(clue),
                styles.focused,
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
