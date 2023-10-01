import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseconfig/firebase";
import { doc, setDoc } from "firebase/firestore";
import "./HomeScreen.css";

const HomeScreen = () => {
  const { currentUser } = auth;
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const chooseStartingPieceOptions = [
    { label: "Black pieces", value: "b" },
    { label: "White pieces", value: "w" },
    { label: "Random", value: "r" },
  ];

  function handlePlayOnline() {
    setShowModal(true);
  }

  async function startOnlineGame(startingPiece) {
    const member = {
      uid: currentUser.uid,
      piece:
        startingPiece === "r"
          ? ["b", "w"][Math.round(Math.random())]
          : startingPiece,
      name: localStorage.getItem("username"),
      creator: true,
      // score: 1000,
    };

    const game = {
      status: "waiting",
      members: [member],
      gameId: `${Math.random().toString(36).substring(2, 10)}_${Date.now()}`,
    };

    await setDoc(doc(db, "games", game.gameId), game);
    navigate(`/game/${game.gameId}`);
  }

  function startLocalGame() {
    navigate("/game/local");
  }

  return (
    <>
      <div className="columns home">
        <div className="column has-background-primary home-columns">
          <button className="button is-link" onClick={startLocalGame}>
            Play Locally
          </button>
        </div>
        <div className="column has-background-link home-columns">
          <button className="button is-primary" onClick={handlePlayOnline}>
            Play Online
          </button>
        </div>
      </div>
      <div className={`modal ${showModal ? "is-active" : ""}`}>
        <div className="modal-background"></div>
        <div className="modal-content">
          <div className="card">
            <div className="card-content">
              <div className="content">
                Please Select the piece you want to start
              </div>
            </div>
            <footer className="card-footer">
              {chooseStartingPieceOptions.map(({ label, value }) => (
                <span
                  className="card-footer-item pointer"
                  key={value}
                  onClick={() => startOnlineGame(value)}
                >
                  {label}
                </span>
              ))}
            </footer>
          </div>
        </div>
        <button
          className="modal-close is-large"
          onClick={() => setShowModal(false)}
        ></button>
      </div>
    </>
  );
};

export default HomeScreen;
