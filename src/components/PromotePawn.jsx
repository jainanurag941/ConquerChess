import React from "react";
import BoardSquareType from "./BoardSquareType";
import { move } from "../utils/GameLogic";
import "./PromotePawn.css";

const validPiecesToPromote = ["r", "n", "b", "q"];

const PromotePawn = ({ promotion }) => {
  const { from, to, color } = promotion;

  return (
    <div className="chessboard">
      {validPiecesToPromote.map((piece, index) => (
        <div key={index} className="promote-piece-square">
          <BoardSquareType black={index % 3 === 0}>
            <div
              className="piece-container"
              onClick={() => move(from, to, piece)}
            >
              <img
                src={require(`../assets/${piece}_${color}.png`)}
                alt={`${piece}_${color}`}
                className="chesspiece cursor-pointer"
              />
            </div>
          </BoardSquareType>
        </div>
      ))}
    </div>
  );
};

export default PromotePawn;
