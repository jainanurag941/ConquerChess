import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../firebaseconfig/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./HomeScreen.css";

// This component presents two options to a user, either to play online or locally
// If user choose to play online, a modal appears where they can select their starting piece (black, white or random)
const HomeScreen = () => {
  const navigate = useNavigate();
  const { currentUser } = auth;

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const [showModal, setShowModal] = useState(false);
  const [open, setOpen] = useState(false);

  const chooseStartingPieceOptions = [
    { label: "Black pieces", value: "b" },
    { label: "White pieces", value: "w" },
    { label: "Random", value: "r" },
  ];

  function handlePlayOnline() {
    setShowModal(true);
  }

  // This function stores the information of game along with the person who started the game and saves it in firebase.
  // Then it redirects the user to game page
  async function startOnlineGame(startingPiece) {
    const member = {
      uid: currentUser.uid,
      piece:
        startingPiece === "r"
          ? ["b", "w"][Math.round(Math.random())]
          : startingPiece,
      name: localStorage.getItem("username"),
      creator: true,
    };

    const memberDataRef = doc(db, "users", currentUser.uid);
    const memberDocSnap = await getDoc(memberDataRef);
    if (!memberDocSnap.exists()) {
      await setDoc(doc(db, "users", currentUser.uid), {
        uid: currentUser.uid,
        name: localStorage.getItem("username"),
        score: 1000,
      });
    }

    const game = {
      status: "waiting",
      members: [member],
      gameId: `${Math.random().toString(36).substring(2, 10)}_${Date.now()}`,
    };

    await setDoc(doc(db, "games", game.gameId), game);
    navigate(`/game/${game.gameId}`);
  }

  // This functions signs out a user
  async function signOut() {
    await auth.signOut();
    localStorage.removeItem("username");
    navigate("/");
  }

  // This function starts a local game and redirects user to game page
  function startLocalGame() {
    navigate("/game/local");
  }

  const brandLogo = require("../assets/img-1.png");

  return (
    <>
      <div className="shadow-md w-full fixed top-0 left-0">
        <div className="md:flex items-center justify-between bg-violet-100 py-4 md:px-10 px-7">
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
            className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static bg-violet-100 md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${
              open ? "top-20 opacity-100" : "top-[-490px]"
            } md:opacity-100 opacity-0`}
          >
            <li className="md:ml-8 text-xl md:my-0 my-7">
              <Link
                className="hover:text-gray-400 duration-500 font-bold"
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

      <div className="columns home my-0 pt-20">
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
