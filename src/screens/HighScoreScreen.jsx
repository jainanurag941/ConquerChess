import React, { useEffect, useState } from "react";
import { db } from "../firebaseconfig/firebase";
import { collection, getDocs } from "firebase/firestore";

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
      <table className="table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {highScoreData &&
            highScoreData.map((playerData, index) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>{playerData.name}</td>
                <td>{playerData.score}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
};

export default HighScoreScreen;
