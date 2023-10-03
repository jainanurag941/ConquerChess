import React, { useEffect, useState } from "react";
import "./ChessBoard.css";
import BoardSquareBlock from "./BoardSquareBlock";

// This component is used to represent the chessboard in UI and maps each piece to their respective position
const ChessBoard = ({ chessboard, position }) => {
  const [currBoard, setCurrBoard] = useState([]);

  // The useEffect is used to flip the board for the respective user to enhance their point of view experience
  // The board flips for the user when their turn comes
  useEffect(() => {
    setCurrBoard(
      position === "w" ? chessboard.flat() : chessboard.flat().reverse()
    );
  }, [chessboard, position]);

  // This function finds the coordinates of the block by taking block index as a parameter
  function getCoordinatesOfBlock(index) {
    const x = position === "w" ? index % 8 : Math.abs((index % 8) - 7);
    const y =
      position === "w"
        ? Math.abs(Math.floor(index / 8) - 7)
        : Math.floor(index / 8);
    return { x, y };
  }

  // This function helps in determining if the color of block is white or black
  function isBlack(index) {
    const { x, y } = getCoordinatesOfBlock(index);
    return (x + y) % 2 === 1;
  }

  // This function calculates the position of piece according to chess notations like e2, a8. It accepts block index as parameter
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
