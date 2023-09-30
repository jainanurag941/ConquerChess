import React from "react";
import BoardSquareType from "./BoardSquareType";
import SquareBlockPiece from "./SquareBlockPiece";
import "./BoardSquareBlock.css";

const BoardSquareBlock = ({ chesspiece, black }) => {
  return (
    <div className="square-board-dim">
      <BoardSquareType black={black}>
        {chesspiece && <SquareBlockPiece chesspiece={chesspiece} />}
      </BoardSquareType>
    </div>
  );
};

export default BoardSquareBlock;
