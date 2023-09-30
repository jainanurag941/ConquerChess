import React from "react";
import "./BoardSquareType.css";

const BoardSquareType = ({ children, black }) => {
  const squareBgColor = !black ? "white-square-block" : "black-square-block";

  return <div className={`${squareBgColor} square-board-dim`}>{children}</div>;
};

export default BoardSquareType;
