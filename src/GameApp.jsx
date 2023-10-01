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
  const [initResult, setInitResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [position, setPosition] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    let subscribe;

    async function init() {
      const res = await initGameState(
        id !== "local" ? doc(db, "games", id) : null
      );

      setInitResult(res);
      setLoading(false);

      if (!res) {
        subscribe = chessGameObservable.subscribe((game) => {
          setChessBoard(game.board);
          setIsGameOver(game.isGameOver);
          setResult(game.result);
          setPosition(game.position);
        });
      }
    }

    init();

    return () => subscribe && subscribe.unsubscribe();
  }, [id]);

  if (loading) {
    return "Loading ...";
  }
  if (initResult === "Not Found") {
    return "Game Not found";
  }

  if (initResult === "intruder") {
    return "The game is already full";
  }

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
        <ChessBoard chessboard={chessboard} position={position} />
      </div>
      {result && <p className="game-over-text">{result}</p>}
    </div>
  );
}

export default GameApp;
