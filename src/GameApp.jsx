import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const [status, setStatus] = useState("");

  const navigate = useNavigate();

  const { id } = useParams();

  const sharebleLink = window.location.href;

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
          setStatus(game.status);
        });
      }
    }

    init();

    return () => subscribe && subscribe.unsubscribe();
  }, [id]);

  async function copyToClipboard() {
    await navigator.clipboard.writeText(sharebleLink);
  }

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
          <button
            onClick={async () => {
              await resetGame();
              navigate("/");
            }}
          >
            <span className="game-over-text"> NEW GAME</span>
          </button>
        </h2>
      )}
      <div className="chessboard-container">
        <ChessBoard chessboard={chessboard} position={position} />
      </div>
      {result && <p className="game-over-text">{result}</p>}
      {status === "waiting" && (
        <div className="notification is-link share-game">
          <strong>Share this game to continue</strong>
          <br />
          <br />
          <div className="field has-addons">
            <div className="control is-expanded">
              <input
                type="text"
                name="sharebleLink"
                id="sharebleLink"
                className="input"
                readOnly
                value={sharebleLink}
              />
            </div>
            <div className="control">
              <button className="button is-info" onClick={copyToClipboard}>
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GameApp;
