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

// This component describes individual block on chessboard and piece that the block holds
const BoardSquareBlock = ({ chesspiece, black, position }) => {
  // promotion is used to check if there is any pawn which can be promoted to rook, knight, bishop or queen
  const [promotion, setPromotion] = useState(null);

  // useDrop is used so that a peice can be dragged and drop to the the respective position for a smoother game play.
  // It acceps chesspiece, the similar name was used in drag function
  // fromPosition holds the initial position of the piece before it was dragged
  // handleMoveIfPromotionOrNot first checks if there is available promotion, then it promotes the pawn, additionaly it moves the piece to where it was supposed to be dropped

  const [, drop] = useDrop({
    accept: "chesspiece",
    drop: (piece) => {
      const [fromPosition] = piece.id.split("_");
      handleMoveIfPromotionOrNot(fromPosition, position);
    },
  });

  // useEffect is triggered whenever there is a change in position of piece.
  // If there is a pending promotion, value of promotion is updated and passed to PromotePawn component
  // chessGameObservable is a BehaviorSubject that has a notion of the current value that it stores and emits the current value to new subscribers
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
