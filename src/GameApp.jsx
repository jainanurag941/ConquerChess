import React, { useEffect, useState } from "react";
import "./GameApp.css";
import {
  chessGameObservable,
  initGameState,
  resetGame,
} from "./utils/GameLogic";
import ChessBoard from "./components/ChessBoard";

function GameApp() {
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
    <div className="app-container">
      {isGameOver && (
        <h2 className="game-over-text">
          GAME OVER
          <button onClick={resetGame}>
            <span className="game-over-text"> NEW GAME</span>
          </button>
        </h2>
      )}
      <div className="chessboard-container">
        <ChessBoard chessboard={chessboard} />
      </div>
      {result && <p className="game-over-text">{result}</p>}
    </div>
  );
}

export default GameApp;
