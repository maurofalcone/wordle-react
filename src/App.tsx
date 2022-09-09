import "./App.css";
import Board from "./components/Board/Board";
import Keyboard from "./components/Keyboard/Keyboard";
import KeyboardContextProvider from "./store/GameContext";

function App() {
  return (
    <KeyboardContextProvider>
      <div className="app">
        <Board />
        <Keyboard />
      </div>
    </KeyboardContextProvider>
  );
}

export default App;
