import React, { useEffect, useState } from "react";
import { db } from "../firebaseconfig/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

// This component displays player rankings, their name and score
const HighScoreScreen = () => {
  const [highScoreData, setHighScoreData] = useState([]);

  useEffect(() => {
    async function temp() {
      // querySnapshot contains snapshot of games collection in the database
      const querySnapshot = await getDocs(collection(db, "users"));

      // finalHighScoreArrayToDisplay stores the final players data to be displayed
      let finalHighScoreArrayToDisplay = [];

      // The below method is used to process the data of every game played
      querySnapshot.forEach((doc) => {
        // individualGameMembersData stores data of player
        const individualGameMemberData = doc.data();

        finalHighScoreArrayToDisplay.push(individualGameMemberData);
      });

      finalHighScoreArrayToDisplay.sort((a, b) => {
        return b.score - a.score;
      });

      setHighScoreData(finalHighScoreArrayToDisplay);
    }

    temp();
  }, []);

  const brandLogo = require("../assets/img-1.png");

  return (
    <>
      <div className="shadow-md w-full top-0 left-0">
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
        </div>
      </div>

      <div className="bg-green-400 flex flex-col justify-center items-center h-screen overflow-hidden">
        <h1 className="text-4xl mb-4 font-black">LeaderBoard</h1>
        <table className="shadow-2x11 font-[Poppins] border-2 border-green-200 w-6/12 overflow-hidden">
          <thead className="text-white text-center">
            <tr>
              <th className="py-3 bg-green-600">Rank</th>
              <th className="py-3 bg-green-600">Player Name</th>
              <th className="py-3 bg-green-600">Score</th>
            </tr>
          </thead>
          <tbody className="text-violet-900 text-center">
            {highScoreData &&
              highScoreData.map((playerData, index) => (
                <tr
                  key={playerData.uid}
                  className="bg-violet-200 hover:bg-violet-300 hover:scale-105 cursor-pointer duration-300"
                >
                  <th className="py-3 px-6">{index + 1}</th>
                  <td className="py-3 px-6">{playerData.name}</td>
                  <td className="py-3 px-6">{playerData.score}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default HighScoreScreen;
