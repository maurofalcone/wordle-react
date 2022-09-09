import {
  createContext,
  useState,
  PropsWithChildren,
  useCallback,
  useEffect,
} from "react";
import { allowedKeys } from "../assets/keyboard";
import { words } from "../assets/words";

export const GameContext = createContext<{
  boardWords: string[];
  currentRow: number;
  pressedChar: Array<string[]>;
  isRowSubmitted: boolean[];
  isRowCompleted: boolean[];
  isGameCompleted: boolean;
  isInputDisabled: boolean;
  handleKeyPress: (a: string) => void;
  incrementRow: () => void;
  submitRow: () => void;
  completeRow: () => void;
  resetGame: () => void;
}>({
  boardWords: [],
  isGameCompleted: false,
  currentRow: 0,
  pressedChar: [[]],
  isRowSubmitted: [],
  isRowCompleted: [],
  isInputDisabled: false,
  handleKeyPress: () => {},
  incrementRow: () => {},
  submitRow: () => {},
  completeRow: () => {},
  resetGame: () => {},
});

const getShuffledWords = () => {
  return words.sort(() => 0.5 - Math.random()).slice(0, 1);
};

const initialState = {
  shuffledWords: getShuffledWords(),
  isGameCompleted: false,
  currentRow: 0,
  pressedChar: [],
  isRowSubmitted: [],
  isRowCompleted: [],
  isInputDisabled: false,
};

const GameContextProvider = ({ children }: PropsWithChildren) => {
  const [pressedChar, setPressedChar] = useState<Array<string[]>>(
    initialState.pressedChar
  );
  const [isInputDisabled, setInputDisabled] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState(initialState.currentRow);
  const [isRowSubmitted, setRowSubmitted] = useState<boolean[]>(
    initialState.isRowSubmitted
  );
  const [isRowCompleted, setRowCompleted] = useState<boolean[]>(
    initialState.isRowCompleted
  );
  const [shuffledWords, setShuffledWords] = useState(
    initialState.shuffledWords
  );
  const [isGameCompleted, setGameCompleted] = useState(
    initialState.isGameCompleted
  );

  const undoSubmitRow = useCallback(() => {
    if (pressedChar[currentRow].length === 5) {
      let newSumittedRows = [...isRowSubmitted];
      newSumittedRows[currentRow] = false;
      setRowSubmitted(newSumittedRows);
    }
  }, [currentRow, isRowSubmitted, pressedChar]);

  const incrementRow = useCallback(() => {
    setCurrentRow(currentRow + 1);
  }, [currentRow]);

  const updateRowStatus = useCallback(() => {
    if (words.includes(pressedChar[currentRow].join("").toLocaleLowerCase())) {
      let newCompletedRows = [...isRowCompleted];
      newCompletedRows[currentRow] = true;
      setRowCompleted(() => newCompletedRows);
      return true;
    } else {
      let newCompletedRows = [...isRowCompleted];
      newCompletedRows[currentRow] = false;
      setRowCompleted(() => newCompletedRows);
      return false;
    }
  }, [currentRow, isRowCompleted, pressedChar]);

  const submitRow = useCallback(() => {
    if (pressedChar[currentRow].length === 5) {
      let newSumittedRows = [...isRowSubmitted];
      newSumittedRows[currentRow] = true;
      setRowSubmitted(newSumittedRows);
    }
  }, [currentRow, isRowSubmitted, pressedChar]);

  const resetGame = () => {
    setGameCompleted(() => initialState.isGameCompleted);
    setShuffledWords(() => getShuffledWords());
    setCurrentRow(() => initialState.currentRow);
    setPressedChar(() => initialState.pressedChar);
    setRowCompleted(() => initialState.isRowCompleted);
    setRowSubmitted(() => initialState.isRowSubmitted);
    setInputDisabled(() => initialState.isInputDisabled);
  };

  const updateGameStatus = useCallback(() => {
    if (
      shuffledWords[0] === pressedChar[currentRow].join("").toLocaleLowerCase()
    ) {
      setInputDisabled(() => true);
      setTimeout(() => {
        setGameCompleted(() => true);
      }, 2000);
    } else {
      incrementRow();
    }
  }, [currentRow, incrementRow, pressedChar, shuffledWords]);

  const handleEnterKeyPress = useCallback(() => {
    submitRow();
    const isCompleted = updateRowStatus();
    if (isCompleted) {
      updateGameStatus();
      incrementRow();
    }
  }, [updateGameStatus, incrementRow, submitRow, updateRowStatus]);

  const handleKeyPress = useCallback(
    (value: string) => {
      if (!isInputDisabled) {
        setPressedChar((arr) => {
          let updatedArray = [...arr];
          if (updatedArray[currentRow]) {
            if (value === "\r" && !isRowSubmitted[currentRow]) {
              handleEnterKeyPress();
            } else if (value === "\b") {
              if (isRowSubmitted[currentRow]) {
                undoSubmitRow();
              }
              const newArr = [...updatedArray[currentRow]];
              newArr.pop();
              updatedArray[currentRow] = newArr;
            } else {
              if (updatedArray[currentRow].length <= 4) {
                const newArr = [...updatedArray[currentRow], value];
                updatedArray[currentRow] = newArr;
              }
            }
          } else {
            if (value !== "\r") updatedArray[currentRow] = [value];
          }
          return updatedArray;
        });
      }
    },
    [
      currentRow,
      handleEnterKeyPress,
      isInputDisabled,
      isRowSubmitted,
      undoSubmitRow,
    ]
  );

  const getChar = useCallback(
    (evt: any) => {
      evt = evt || window.event;
      const charCode = evt.keyCode || evt.which;
      const charStr = String.fromCharCode(charCode);
      if (allowedKeys.includes(charStr)) {
        handleKeyPress(charStr.toLocaleLowerCase());
      }
    },
    [handleKeyPress]
  );
  console.log(shuffledWords);

  useEffect(() => {
    window.addEventListener("keyup", getChar);

    return () => {
      window.removeEventListener("keyup", getChar);
    };
  }, [getChar]);

  return (
    <GameContext.Provider
      value={{
        isInputDisabled,
        pressedChar,
        handleKeyPress,
        currentRow,
        incrementRow,
        submitRow,
        isRowSubmitted,
        completeRow: updateRowStatus,
        boardWords: shuffledWords,
        isRowCompleted,
        isGameCompleted,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameContextProvider;
