import React from "react";
import { useDrag, DragPreviewImage } from "react-dnd";
import "./SquareBlockPiece.css";

// This component displays individual piece on the chessboard
const SquareBlockPiece = ({ chesspiece, position }) => {
  const { type, color } = chesspiece;
  const chessPieceImg = require(`../assets/${type}_${color}.png`);

  // The useDrag hook is used to grab a piece from its position so that it can be moved
  // isDragging is used so that when piece is moved, it is removed from its current position
  // The information is passed to DragPreviewImage to achieve the desired functionality
  const [{ isDragging }, drag, preview] = useDrag({
    type: "chesspiece",
    item: {
      id: `${position}_${type}_${color}`,
    },
    collect: (monitor) => {
      return { isDragging: !!monitor.isDragging() };
    },
  });

  return (
    <>
      <DragPreviewImage connect={preview} src={chessPieceImg} />
      <div
        className="chesspiece-container"
        ref={drag}
        style={{ opacity: isDragging ? 0 : 1 }}
      >
        <img
          src={chessPieceImg}
          alt={`${type}_${color}`}
          className="chesspiece"
        />
      </div>
    </>
  );
};

export default SquareBlockPiece;
