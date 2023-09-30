import { Chess } from "chess.js";
import { BehaviorSubject } from "rxjs";

const chess = new Chess();

export const chessGameObservable = new BehaviorSubject({
  board: chess.board(),
});

export function move(from, to) {
  
}
