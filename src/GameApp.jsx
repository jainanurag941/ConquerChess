import React, { useEffect, useState } from "react";
import { css } from "@emotion/react";
import { PacmanLoader } from "react-spinners";
import { useParams, useNavigate, Link } from "react-router-dom";
import { db, auth } from "./firebaseconfig/firebase";
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
  const [game, setGame] = useState({});
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

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
          setGame(game);
        });
      }
    }

    init();

    return () => subscribe && subscribe.unsubscribe();
  }, [id]);

  async function copyToClipboard() {
    await navigator.clipboard.writeText(sharebleLink);
  }

  async function signOut() {
    await auth.signOut();
    localStorage.removeItem("username");
    localStorage.removeItem("savedGame");
    navigate("/");
  }

  if (loading) {
    return (
      <PacmanLoader color="#36d7b7" loading={true} css={override} size={50} />
    );
  }
  if (initResult === "Not Found") {
    return "Game Not found";
  }

  if (initResult === "intruder") {
    return "The game is already full";
  }

  const brandLogo = require("./assets/img-1.png");

  return (
    <>
      <div className="shadow-md w-full fixed top-0 left-0">
        <div className="md:flex items-center justify-between bg-orange-100 py-4 md:px-10 px-7">
          <div className="font-bold text-3xl cursor-pointer flex items-center font-[Poppins]">
            <span className="text-2xl font-[Poppins] cursor-pointer">
              <img className="h-12 inline" src={brandLogo} alt="conquerChess" />
            </span>
            ConquerChess
          </div>
          <div
            onClick={() => setOpen(!open)}
            className="text-3xl absolute right-8 top-6 cursor-pointer md:hidden"
          >
            <ion-icon name={open ? "close-outline" : "menu-outline"}></ion-icon>
          </div>

          <ul
            className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static bg-orange-100 md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${
              open ? "top-20 opacity-100" : "top-[-490px]"
            } md:opacity-100 opacity-0`}
          >
            <li className="md:ml-8 text-xl md:my-0 my-7">
              <Link
                className="hover:text-orange-400 duration-500 font-bold"
                to="/high-score"
              >
                Rankings
              </Link>
            </li>
            {!game.member && (
              <li className="md:ml-8 text-xl md:my-0 my-7">
                <Link
                  className="hover:text-orange-400 duration-500 font-bold"
                  onClick={signOut}
                >
                  SignOut
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="app-container pt-5">
        {!game.member && (
          <h2 className="game-over-text">
            <button
              onClick={() => {
                resetGame();
                navigate("/");
              }}
            >
              <span className="game-over-text"> NEW GAME</span>
            </button>
          </h2>
        )}
        {isGameOver && (
          <h2 className="game-over-text">
            GAME OVER
            {game.member && game.member.creator && (
              <button
                onClick={async () => {
                  await resetGame();
                  navigate("/");
                }}
              >
                <span className="game-over-text"> NEW GAME</span>
              </button>
            )}
            {game.member && game.oponent && game.oponent.creator && (
              <button
                onClick={async () => {
                  navigate("/");
                }}
              >
                <span className="game-over-text"> NEW GAME</span>
              </button>
            )}
          </h2>
        )}
        <div className="chessboard-container">
          {!game.member && <span className="tag is-link hidden-obj">a</span>}
          {game.oponent && game.oponent.name && (
            <span className="tag is-link">{game.oponent.name}</span>
          )}
          <ChessBoard chessboard={chessboard} position={position} />
          {game.member && game.member.name && (
            <span className="tag is-link">{game.member.name}</span>
          )}
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
    </>
  );
}

export default GameApp;
