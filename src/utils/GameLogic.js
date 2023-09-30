import { Chess } from "chess.js";
import { BehaviorSubject } from "rxjs";

let promotion = "rnb2bnr/pppPkppp/8/4p3/7q/8/PPPP1PPP/RNBQKBNR w KQ - 1 5";

const chess = new Chess(promotion);

export const chessGameObservable = new BehaviorSubject();

function updateGameState() {
  const newGame = {
    board: chess.board(),
  };

  chessGameObservable.next(newGame);
}

export function initGameState() {
  updateGameState();
}

export function handleMoveIfPromotionOrNot(from, to) {
  const availablePromotions = chess
    .moves({ verbose: true })
    .filter((mprom) => mprom.promotion);

  
}

export function move(from, to) {
  try {
    const ifValidMove = chess.move({ from, to });

    ifValidMove && updateGameState();
  } catch (error) {}
}
