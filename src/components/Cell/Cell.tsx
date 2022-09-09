import React, { useContext } from "react";
import { GameContext } from "../../store/GameContext";
import styles from "./Cell.module.css";

interface Props {
  char: string;
  word: string;
  pressedChar: string;
  rowIdx: number;
  cellIdx: number;
}

const getStatus = (
  word: string,
  char: string,
  pressedChar: string,
  isSubmitted: boolean,
  isRowCompleted: boolean,
  isAlreadyThere: boolean
) => {
  const formattedChar = pressedChar.toLowerCase();
  if (char === formattedChar && isRowCompleted) {
    return styles.success;
  }
  if (isSubmitted) {
    if (!isRowCompleted) {
      return styles.unexistingWord;
    }
    if (char !== formattedChar && !word.includes(formattedChar)) {
      return styles.error;
    }
    if (
      formattedChar &&
      char !== formattedChar &&
      word.includes(formattedChar) &&
      !isAlreadyThere
    ) {
      return styles.warning;
    }
  }
  return styles.container;
};

function Cell({ word, char, pressedChar, rowIdx, cellIdx }: Props) {
  const {
    isRowSubmitted,
    isRowCompleted,
    isGameCompleted,
    currentRow,
    pressedChar: enteredChars,
    isInputDisabled,
  } = useContext(GameContext);
  const completedRow = isRowCompleted[rowIdx] || false;

  const checkExisistingWord = () => {
    if (enteredChars[rowIdx]) {
      const formattedChar = pressedChar.toLowerCase();
      const mappedWord = word
        .split("")
        .reduce<Record<string, number>>((a, w) => {
          if (a[w]) {
            a[w] = a[w] + 1;
          } else {
            a[w] = 1;
          }
          return a;
        }, {});

      const mappedEnteredCharacters = enteredChars[rowIdx].reduce<
        Record<string, number>
      >((a, e) => {
        if (a[e]) {
          a[e] = a[e] + 1;
        } else {
          a[e] = 1;
        }
        return a;
      }, {});
      console.log(
        mappedWord[formattedChar],
        mappedEnteredCharacters[formattedChar],
        formattedChar
      );
      if (mappedWord[formattedChar] < mappedEnteredCharacters[formattedChar]) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  };

  const cellIsInActiveRow =
    !isInputDisabled &&
    currentRow === rowIdx &&
    ((cellIdx === 0 &&
      ((enteredChars[currentRow] && !enteredChars[currentRow].length) ||
        !enteredChars[currentRow])) ||
      (enteredChars[currentRow] &&
        enteredChars[currentRow][cellIdx - 1] &&
        !enteredChars[currentRow][cellIdx]));

  const mainClass = getStatus(
    word,
    char,
    pressedChar,
    isRowSubmitted[rowIdx],
    completedRow,
    checkExisistingWord()
  );

  return (
    <div
      className={`${mainClass} ${pressedChar && styles.animatedEntry} ${
        cellIsInActiveRow && styles.activeCell
      }`}
    >
      {isGameCompleted
        ? null
        : pressedChar === "º"
        ? "Ñ"
        : pressedChar.toUpperCase()}
    </div>
  );
}

export default Cell;
