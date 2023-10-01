import React, { useEffect, useState } from "react";
import "./ChessBoard.css";
import BoardSquareBlock from "./BoardSquareBlock";

const ChessBoard = ({ chessboard, position }) => {
  const [currBoard, setCurrBoard] = useState([]);

  useEffect(() => {
    setCurrBoard(
      position === "w" ? chessboard.flat() : chessboard.flat().reverse()
    );
  }, [chessboard, position]);

  function getCoordinatesOfBlock(index) {
    const x = position === "w" ? index % 8 : Math.abs((index % 8) - 7);
    const y =
      position === "w"
        ? Math.abs(Math.floor(index / 8) - 7)
        : Math.floor(index / 8);
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
      {currBoard.map((chesspiece, index) => (
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
