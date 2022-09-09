import React, { useContext } from "react";
import styles from "./Row.module.css";
import Cell from "../Cell/Cell";
import { GameContext } from "../../store/GameContext";

interface Props {
  word: string;
  rowIdx: number;
}

function Row({ rowIdx, word }: Props) {
  const { pressedChar } = useContext(GameContext);
  return (
    <div className={styles.container}>
      {word.split("").map((char, idx) => {
        return (
          <Cell
            key={idx}
            pressedChar={
              pressedChar[rowIdx] && pressedChar[rowIdx][idx]
                ? pressedChar[rowIdx][idx]
                : ""
            }
            rowIdx={rowIdx}
            word={word}
            char={char}
            cellIdx={idx}
          />
        );
      })}
    </div>
  );
}

export default Row;
