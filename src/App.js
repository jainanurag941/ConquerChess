import React, { useEffect, useState } from "react";
import "./App.css";
import { chessGameObservable, initGameState } from "./utils/GameLogic";
import ChessBoard from "./components/ChessBoard";

function App() {
  const [chessboard, setChessBoard] = useState([]);

  useEffect(() => {
    initGameState();
    
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
