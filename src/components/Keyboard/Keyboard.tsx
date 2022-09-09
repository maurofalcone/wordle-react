import { useContext } from "react";
import { keys } from "../../assets/keyboard";
import { GameContext } from "../../store/GameContext";
import styles from "./Keyboard.module.css";

function Keyboard() {
  const { handleKeyPress } = useContext(GameContext);
  return (
    <div className={styles.container}>
      {keys.map((key, i) => {
        return (
          <div key={i} className={styles.keyContainer}>
            {key.map((char) => {
              return (
                <button
                  key={char}
                  onClick={() => {
                    handleKeyPress(char);
                  }}
                  className={
                    char === "\r" || char === "\b"
                      ? styles.specialKey
                      : styles.key
                  }
                >
                  {char === "\b" ? "⌫" : char === "\r" ? "ENVIAR" : char}
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default Keyboard;
