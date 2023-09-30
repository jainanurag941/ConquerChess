import React from "react";
import BoardSquareType from "./BoardSquareType";
import SquareBlockPiece from "./SquareBlockPiece";
import { useDrop } from "react-dnd";
import { move } from "../utils/GameLogic";
import "./BoardSquareBlock.css";

const BoardSquareBlock = ({ chesspiece, black, position }) => {
  const [, drop] = useDrop({
    accept: "chesspiece",
    drop: (piece) => {
      const [fromPosition] = piece.id.split("_");
      move(fromPosition, position);
    },
  });

  return (
    <div className="square-board-dim" ref={drop}>
      <BoardSquareType black={black}>
        {chesspiece && (
          <SquareBlockPiece chesspiece={chesspiece} position={position} />
        )}
      </BoardSquareType>
    </div>
  );
};

export default BoardSquareBlock;
