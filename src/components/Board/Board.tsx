import React, { useContext } from "react";
import styles from "./Board.module.css";
import Row from "../Row/Row";
import { GameContext } from "../../store/GameContext";

function Board() {
  const { boardWords, isGameCompleted, resetGame } = useContext(GameContext);
  const renderBoard = () => {
    const list = [];
    for (let i = 0; i < 5; i++) {
      const w = boardWords[0];
      list.push(w);
    }
    const mappedElements = list.map((w, i) => {
      return <Row key={i} word={w} rowIdx={i} />;
    });
    return mappedElements;
  };
  return isGameCompleted ? (
    <div className={styles.winner}>
      <div>You won!</div>
      <button onClick={resetGame}>Reset</button>
    </div>
  ) : (
    <div className={styles.container}>{renderBoard()}</div>
  );
}

export default Board;
