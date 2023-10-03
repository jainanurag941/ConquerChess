import React from "react";
import BoardSquareType from "./BoardSquareType";
import { move } from "../utils/GameLogic";
import "./PromotePawn.css";

const validPiecesToPromote = ["r", "n", "b", "q"];

// This component displays four options of promoting a pawn to the user, if there is a valid promotion and moves the piece.
// Then the information is passed to the BoardSquareType component for the piece to render
// A pawn can be promoted to rook, knight, bishop and queen
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
