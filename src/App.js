import React, { useEffect, useState } from "react";
import "./App.css";
import { chessGameObservable } from "./utils/GameLogic";
import ChessBoard from "./components/ChessBoard";

function App() {
  const [chessboard, setChessBoard] = useState([]);

  useEffect(() => {
    const subscribe = chessGameObservable.subscribe((game) => {
      setChessBoard(game.board);
    });

    return () => subscribe.unsubscribe();
  }, []);
  return (
    <div className="container">
      <div className="chessboard-container">
        <ChessBoard chessboard={chessboard} />
      </div>
    </div>
  );
}

export default App;
