import React, { useEffect, useState } from "react";
import { css } from "@emotion/react";
import { PacmanLoader } from "react-spinners";
import { useParams, useNavigate, Link } from "react-router-dom";
import { db, auth } from "./firebaseconfig/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc } from "firebase/firestore";
import "./GameApp.css";
import {
  chessGameObservable,
  initGameState,
  resetGame,
} from "./utils/GameLogic";
import ChessBoard from "./components/ChessBoard";

// This component displays the game page with chessboard. When the game gets over, it displays the winner, how they won and option to start the new game
function GameApp() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  // chessboard stores the orientation of board at every point of time
  const [chessboard, setChessBoard] = useState([]);

  // isGameOver stores if game is over or not
  const [isGameOver, setIsGameOver] = useState();

  // result stores how a user won the game
  const [result, setResult] = useState();

  // initResult stores the result of game at every point of time. It stores if it was a valid game or game is full or was it a valid game
  const [initResult, setInitResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [position, setPosition] = useState(true);

  // status is used to see if game is in waiting state, it helps in displaying a shareable link to user
  // which they can share with their friend and when their friend joins, the link disappears so that game can proceed
  const [status, setStatus] = useState("");

  // game stores the entire information of the current game in progress
  const [game, setGame] = useState({});
  const [open, setOpen] = useState(false);

  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  const { id } = useParams();

  // The sharebleLink stores the link which user can share with their friends and play a game online
  const sharebleLink = window.location.href;

  useEffect(() => {
    try {
      if (!user) {
        navigate("/");
      } else {
        let subscribe;

        // init function checks if game is local or online game. If it is an online game, chessGameObservable Behavior Subject is subscribed to the game
        // and for any change in the board orientation, it listens and updates the game information
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
      }
    } catch (error) {}
  }, [id, navigate, user]);

  async function copyToClipboard() {
    await navigator.clipboard.writeText(sharebleLink);
  }

  // This functions signs out a user
  async function signOut() {
    await auth.signOut();
    localStorage.removeItem("username");
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
            <Link to="/">
              <span className="text-2xl font-[Poppins] cursor-pointer">
                <img
                  className="h-12 inline"
                  src={brandLogo}
                  alt="conquerChess"
                />
              </span>
              ConquerChess
            </Link>
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
            <li className="md:ml-8 text-xl md:my-0 my-7">
              <Link
                className="hover:text-orange-400 duration-500 font-bold"
                onClick={signOut}
              >
                SignOut
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="app-container pt-5">
        {!game.member && (
          <h2 className="game-over-text">
            <button
              onClick={() => {
                resetGame();
                navigate("/home");
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
                  navigate("/home");
                }}
              >
                <span className="game-over-text"> NEW GAME</span>
              </button>
            )}
            {game.member && game.oponent && game.oponent.creator && (
              <button
                onClick={async () => {
                  navigate("/home");
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
