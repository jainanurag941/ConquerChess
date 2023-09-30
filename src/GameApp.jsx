import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "./firebaseconfig/firebase";
import { doc } from "firebase/firestore";
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

  const { id } = useParams();

  useEffect(() => {
    initGameState(id !== "local" ? doc(db, "games", id) : null);

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
