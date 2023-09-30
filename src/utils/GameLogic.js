import { Chess } from "chess.js";
import { BehaviorSubject } from "rxjs";

const promotion = "rnb2bnr/pppPkppp/8/4p3/7q/8/PPPP1PPP/RNBQKBNR w KQ - 1 5";
const staleMate = "4k3/4P3/4K3/8/8/8/8/8 b - - 0 78";
const checkMate =
  "rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 1 3";
const insuficcientMaterial = "k7/8/n7/8/8/8/8/7K b - - 0 1";

const chess = new Chess(staleMate);

export const chessGameObservable = new BehaviorSubject();

function finalGameResult() {
  if (chess.isCheckmate()) {
    const winner = chess.turn() === "w" ? "BLACK" : "WHITE";
    return `CHECKMATE - WINNER - ${winner}`;
  } else if (chess.isDraw()) {
    let reason = "Game ended in a draw";
    if (chess.isStalemate()) {
      reason = "STALEMATE";
    } else if (chess.isThreefoldRepetition()) {
      reason = "REPETITION";
    } else if (chess.isInsufficientMaterial()) {
      reason = "INSUFFICIENT MATERIAL";
    }
    return `DRAW - ${reason}`;
  } else {
    return "UNKNOWN REASON";
  }
}

function updateGameState(pendingPromotion) {
  const isGameOver = chess.isGameOver();

  const newGame = {
    board: chess.board(),
    pendingPromotion,
    isGameOver,
    result: isGameOver ? finalGameResult() : null,
  };

  localStorage.setItem("savedGame", chess.fen());

  chessGameObservable.next(newGame);
}

export function initGameState() {
  const fetchSavedGameFromStorage = localStorage.getItem("savedGame");

  fetchSavedGameFromStorage && chess.load(fetchSavedGameFromStorage);
  updateGameState();
}

export function handleMoveIfPromotionOrNot(from, to) {
  const availablePromotions = chess
    .moves({ verbose: true })
    .filter((mprom) => mprom.promotion);

  if (
    availablePromotions.some((p) => `${p.from}:${p.to}` === `${from}:${to}`)
  ) {
    const pendingPromotion = { from, to, color: availablePromotions[0].color };
    updateGameState(pendingPromotion);
  }

  const { pendingPromotion } = chessGameObservable.getValue();

  if (!pendingPromotion) {
    move(from, to);
  }
}

export function move(from, to, promotion) {
  try {
    const ifMoveToPromote = { from, to };
    if (promotion) {
      ifMoveToPromote.promotion = promotion;
    }

    const ifValidMove = chess.move(ifMoveToPromote);

    ifValidMove && updateGameState();
  } catch (error) {}
}

export function resetGame() {
  chess.reset();
  updateGameState();
}
