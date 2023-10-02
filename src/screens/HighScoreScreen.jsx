import React, { useEffect, useState } from "react";
import { db } from "../firebaseconfig/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

const HighScoreScreen = () => {
  const [highScoreData, setHighScoreData] = useState([]);

  useEffect(() => {
    async function temp() {
      const querySnapshot = await getDocs(collection(db, "games"));
      let finalHighScoreArrayToDisplay = [];
      querySnapshot.forEach((doc) => {
        const individualGameMembersData = doc.data().members;
        const firstMember = individualGameMembersData[0];
        const secondMember = individualGameMembersData[1];

        const firstMemberRequiredData = {
          name: firstMember.name,
          score: firstMember.score,
        };
        finalHighScoreArrayToDisplay.push(firstMemberRequiredData);

        const secondMemberRequiredData = {
          name: secondMember.name,
          score: secondMember.score,
        };
        finalHighScoreArrayToDisplay.push(secondMemberRequiredData);
      });

      finalHighScoreArrayToDisplay.sort((a, b) => {
        return b.score - a.score;
      });

      setHighScoreData(finalHighScoreArrayToDisplay);
    }

    temp();
  }, []);

  return (
    <>
      <nav
        className="navbar bg-violet-100"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand">
          <Link
            className="navbar-item has-text-weight-bold is-size-3 has-text-black"
            to="/"
          >
            ConquerChess
          </Link>
        </div>
      </nav>

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
                  key={index}
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
