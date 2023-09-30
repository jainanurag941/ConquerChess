import React from "react";
import "./SquareBlockPiece.css";

const SquareBlockPiece = ({ chesspiece }) => {
  const { type, color } = chesspiece;
  const chessPieceImg = require(`../assets/${type}_${color}.png`);

  return (
    <div className="chesspiece-container">
      <img
        src={chessPieceImg}
        alt={`${type}_${color}`}
        className="chesspiece"
      />
    </div>
  );
};

export default SquareBlockPiece;
