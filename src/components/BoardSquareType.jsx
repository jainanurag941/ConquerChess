import React from "react";
import "./BoardSquareType.css";

// This component determines the color of individual block on chessboard whether it is black or white.
// Every block holds the necessary piece it is responsible for
const BoardSquareType = ({ children, black }) => {
  const squareBgColor = !black ? "white-square-block" : "black-square-block";

  return <div className={`${squareBgColor} square-board-dim`}>{children}</div>;
};

export default BoardSquareType;
