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
  isRowCompleted: boolean
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
      word.includes(formattedChar)
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
    completedRow
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
