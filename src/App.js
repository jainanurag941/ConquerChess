import React, { useEffect, useState } from "react";
import "./App.css";
import { chessGameObservable, initGameState } from "./utils/GameLogic";
import ChessBoard from "./components/ChessBoard";

function App() {
  const [chessboard, setChessBoard] = useState([]);
  const [isGameOver, setIsGameOver] = useState();
  const [result, setResult] = useState();

  useEffect(() => {
    initGameState();

    const subscribe = chessGameObservable.subscribe((game) => {
      setChessBoard(game.board);
      setIsGameOver(game.isGameOver);
      setResult(game.result);
    });

    return () => subscribe.unsubscribe();
  }, []);
  return (
    <div className="container">
      <div className="chessboard-container">
        <ChessBoard chessboard={chessboard} />
      </div>
    </div>
  );
}

export default App;
