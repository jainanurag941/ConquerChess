import { Chess } from "chess.js";
import { BehaviorSubject } from "rxjs";
import { auth } from "../firebaseconfig/firebase";
import { getDoc, updateDoc } from "firebase/firestore";
import { fromRef } from "rxfire/firestore";
import { map } from "rxjs/operators";

const chess = new Chess();

export let chessGameObservable;

let trackGameReference;
let member;

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

async function updateGameState(pendingPromotion, checkIfToReset) {
  const isGameOver = chess.isGameOver();

  if (trackGameReference) {
    if (checkIfToReset) {
      await updateDoc(trackGameReference, {
        status: "over",
      });
    }

    await updateDoc(trackGameReference, {
      gameData: chess.fen(),
      pendingPromotion: pendingPromotion || null,
    });
  } else {
    const newGame = {
      board: chess.board(),
      pendingPromotion,
      isGameOver,
      position: chess.turn(),
      result: isGameOver ? finalGameResult() : null,
    };

    localStorage.setItem("savedGame", chess.fen());

    chessGameObservable.next(newGame);
  }
}

export async function initGameState(gameDataFromFBase) {
  const { currentUser } = auth;

  if (gameDataFromFBase) {
    trackGameReference = gameDataFromFBase;
    const docSnap = await getDoc(gameDataFromFBase);

    if (!docSnap.exists()) {
      return "Not Found";
    }

    const initialGameState = docSnap.data();
    const creator = initialGameState.members.find(
      (member) => member.creator === true
    );

    if (
      initialGameState.status === "waiting" &&
      creator.uid !== currentUser.uid
    ) {
      const currUser = {
        uid: currentUser.uid,
        name: localStorage.getItem("username"),
        piece: creator.piece === "w" ? "b" : "w",
      };
      const updatedMembers = [...initialGameState.members, currUser];

      await updateDoc(gameDataFromFBase, {
        members: updatedMembers,
        status: "ready",
      });
    } else if (
      !initialGameState.members
        .map((member) => member.uid)
        .includes(currentUser.uid)
    ) {
      return "intruder";
    }

    chess.reset();

    chessGameObservable = fromRef(gameDataFromFBase).pipe(
      map((gameDoc) => {
        const game = gameDoc.data();
        const { pendingPromotion, gameData, ...restOfGame } = game;
        member = game.members.find((m) => m.uid === currentUser.uid);
        const oponent = game.members.find((m) => m.uid !== currentUser.uid);
        if (gameData) {
          chess.load(gameData);
        }
        const isGameOver = chess.isGameOver();
        return {
          board: chess.board(),
          pendingPromotion,
          isGameOver,
          position: member.piece,
          member,
          oponent,
          result: isGameOver ? finalGameResult() : null,
          ...restOfGame,
        };
      })
    );
  } else {
    trackGameReference = null;
    chessGameObservable = new BehaviorSubject();

    const fetchSavedGameFromStorage = localStorage.getItem("savedGame");

    fetchSavedGameFromStorage && chess.load(fetchSavedGameFromStorage);
    updateGameState();
  }
}

export function handleMoveIfPromotionOrNot(from, to) {
  const availablePromotions = chess
    .moves({ verbose: true })
    .filter((mprom) => mprom.promotion);

  let pendingPromotion;

  if (
    availablePromotions.some((p) => `${p.from}:${p.to}` === `${from}:${to}`)
  ) {
    pendingPromotion = { from, to, color: availablePromotions[0].color };
    updateGameState(pendingPromotion);
  }

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

    if (trackGameReference) {
      if (member.piece === chess.turn()) {
        const ifValidMove = chess.move(ifMoveToPromote);
        ifValidMove && updateGameState();
      }
    } else {
      const ifValidMove = chess.move(ifMoveToPromote);

      ifValidMove && updateGameState();
    }
  } catch (error) {}
}

export async function resetGame() {
  if (trackGameReference) {
    await updateGameState(null, true);
    chess.reset();
  } else {
    chess.reset();
    updateGameState();
  }
}
