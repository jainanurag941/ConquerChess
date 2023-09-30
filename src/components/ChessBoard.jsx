import React from "react";
import "./ChessBoard.css";
import BoardSquareBlock from "./BoardSquareBlock";

const ChessBoard = ({ chessboard }) => {
  function getCoordinatesOfBlock(index) {
    const x = index % 8;
    const y = Math.abs(Math.floor(index / 8) - 7);
    return { x, y };
  }

  function isBlack(index) {
    const { x, y } = getCoordinatesOfBlock(index);
    return (x + y) % 2 === 1;
  }

  function getPiecePosition(index) {
    const { x, y } = getCoordinatesOfBlock(index);
    const letter = ["a", "b", "c", "d", "e", "f", "g", "h"][x];
    return `${letter}${y + 1}`;
  }

  return (
    <div className="chessboard">
      {chessboard.flat().map((chesspiece, index) => (
        <div key={index} className="square-box-piece">
          <BoardSquareBlock
            chesspiece={chesspiece}
            black={isBlack(index)}
            position={getPiecePosition(index)}
          />
        </div>
      ))}
    </div>
  );
};

export default ChessBoard;
