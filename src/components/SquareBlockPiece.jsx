import React from "react";
import { useDrag, DragPreviewImage } from "react-dnd";
import "./SquareBlockPiece.css";

const SquareBlockPiece = ({ chesspiece, position }) => {
  const { type, color } = chesspiece;
  const chessPieceImg = require(`../assets/${type}_${color}.png`);

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
