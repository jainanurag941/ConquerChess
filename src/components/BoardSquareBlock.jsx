import React, { useEffect, useState } from "react";
import BoardSquareType from "./BoardSquareType";
import SquareBlockPiece from "./SquareBlockPiece";
import PromotePawn from "./PromotePawn";
import { useDrop } from "react-dnd";
import {
  handleMoveIfPromotionOrNot,
  chessGameObservable,
} from "../utils/GameLogic";
import "./BoardSquareBlock.css";

const BoardSquareBlock = ({ chesspiece, black, position }) => {
  const [promotion, setPromotion] = useState(null);

  const [, drop] = useDrop({
    accept: "chesspiece",
    drop: (piece) => {
      const [fromPosition] = piece.id.split("_");
      handleMoveIfPromotionOrNot(fromPosition, position);
    },
  });

  useEffect(() => {
    const subscribe = chessGameObservable.subscribe(({ pendingPromotion }) =>
      pendingPromotion && pendingPromotion.to === position
        ? setPromotion(pendingPromotion)
        : setPromotion(null)
    );
    return () => subscribe.unsubscribe();
  }, [position]);

  return (
    <div className="square-board-dim" ref={drop}>
      <BoardSquareType black={black}>
        {promotion ? (
          <PromotePawn promotion={promotion} />
        ) : chesspiece ? (
          <SquareBlockPiece chesspiece={chesspiece} position={position} />
        ) : null}
      </BoardSquareType>
    </div>
  );
};

export default BoardSquareBlock;
