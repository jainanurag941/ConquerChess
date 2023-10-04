import { Chess } from "chess.js";
import { BehaviorSubject } from "rxjs";
import { auth, db } from "../firebaseconfig/firebase";
import { getDoc, updateDoc, doc, setDoc } from "firebase/firestore";
import { fromRef } from "rxfire/firestore";
import { map } from "rxjs/operators";

// This creates a new chess game to start with
const chess = new Chess();

// chessGameObservable is a BehaviorSubject from rxjs that has a notion of the current value that it stores and emits to all new subscriptions.
// If there is any change to chessboard, it emits the change to both the players
export let chessGameObservable;

// trackGameReference is used to track the game at every point of time
let trackGameReference;
let member;

// finalGameResult helps in determining the final result of game, if game is over and determines the winner.
// It tells how the game ended
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

// updateGameState function updates the game state whenever it changes and saves it in firebase.
async function updateGameState(pendingPromotion, checkIfToReset) {
  // isGameOver checks if game is over or not
  const isGameOver = chess.isGameOver();

  // if trackGameReference is true, it determines it was a online game else it was a local game
  if (trackGameReference) {
    // The condition checks if user pressed on new game button, it updates game status to over and updates in firebase

    try {
      if (checkIfToReset) {
        await updateDoc(trackGameReference, {
          status: "over",
        });
      }

      // This updates game data in firebase whenever any player makes a move
      await updateDoc(trackGameReference, {
        gameData: chess.fen(),
        pendingPromotion: pendingPromotion || null,
      });
    } catch (error) {}
  } else {
    // new Game contains information of local game. Then this game is saved in local storage and is informed to chessGameObservable
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

// initGameState takes care of game state if it was online or local
export async function initGameState(gameDataFromFBase) {
  const { currentUser } = auth;

  if (gameDataFromFBase) {
    trackGameReference = gameDataFromFBase;
    // docSnap stores the game reference from firebase
    const docSnap = await getDoc(gameDataFromFBase);

    if (!docSnap.exists()) {
      return "Not Found";
    }

    const initialGameState = docSnap.data();
    const creator = initialGameState.members.find(
      (member) => member.creator === true
    );

    // This condition checks if the game is in waiting state and user id is different from creator id, then this is 2nd player
    // The information of second player is added to game data and stored in firebase with status updated to ready
    if (
      initialGameState.status === "waiting" &&
      creator.uid !== currentUser.uid
    ) {
      const currUser = {
        uid: currentUser.uid,
        name: localStorage.getItem("username"),
        piece: creator.piece === "w" ? "b" : "w",
      };

      const newUserDataRef = doc(db, "users", currentUser.uid);
      const newUserDocSnap = await getDoc(newUserDataRef);
      if (!newUserDocSnap.exists()) {
        await setDoc(doc(db, "users", currentUser.uid), {
          uid: currentUser.uid,
          name: localStorage.getItem("username"),
          score: 1000,
        });
      }

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
      // This function checks if a third person tries to enter the game, they are blocked with intruder message
      return "intruder";
    }

    chess.reset();

    // The pipe function is used to convert the game data which came from firebase to appropriate format of the application and returns the result
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
    // the else condition takes care of local game. It fetches the game from local storage and updates the board and game state
    trackGameReference = null;
    chessGameObservable = new BehaviorSubject();

    const fetchSavedGameFromStorage = localStorage.getItem("savedGame");

    fetchSavedGameFromStorage && chess.load(fetchSavedGameFromStorage);
    updateGameState();
  }
}

// This function handles if a promotion is to be made or not and then performs the appropriate move
export function handleMoveIfPromotionOrNot(from, to) {
  // Firstly, it checks for all the available promotion using filter
  const availablePromotions = chess
    .moves({ verbose: true })
    .filter((mprom) => mprom.promotion);

  let pendingPromotion;

  // if there is a valid available promotion, it calls the update function which performs the promotion
  if (
    availablePromotions.some((p) => `${p.from}:${p.to}` === `${from}:${to}`)
  ) {
    pendingPromotion = { from, to, color: availablePromotions[0].color };
    updateGameState(pendingPromotion);
  }

  // If no more promotions are there, the corresponding move is made
  if (!pendingPromotion) {
    move(from, to);
  }
}

// the move function moves the piece from starting position to where it should be placed and updates game state
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

// This function reset the game and assigns scores to player on how they won
export async function resetGame() {
  if (trackGameReference) {
    let firstPlayerData;
    let secondPlayerData;

    const docSnap = await getDoc(trackGameReference);
    const finalData = docSnap.data().members;

    firstPlayerData = finalData[0];
    secondPlayerData = finalData[1];

    const firstPlayerDataRef = doc(db, "users", firstPlayerData.uid);
    const firstPlayerDocSnap = await getDoc(firstPlayerDataRef);

    const secondPlayerDataRef = doc(db, "users", secondPlayerData.uid);
    const secondPlayerDocSnap = await getDoc(secondPlayerDataRef);

    // This condition assign score in case of a checkmate
    // Winner gets 30 points and loser score deducts by 20
    if (chess.isCheckmate()) {
      const winner = chess.turn() === "w" ? "b" : "w";

      const firstPiece = firstPlayerData.piece;
      const secondPiece = secondPlayerData.piece;

      if (firstPiece === winner) {
        let score = firstPlayerDocSnap.data().score;
        score = score + 30;
        await updateDoc(firstPlayerDataRef, {
          score: score,
        });

        score = secondPlayerDocSnap.data().score;
        score = score - 20;
        await updateDoc(secondPlayerDataRef, {
          score: score,
        });
      } else if (secondPiece === winner) {
        let score = firstPlayerDocSnap.data().score;
        score = score - 20;
        await updateDoc(firstPlayerDataRef, {
          score: score,
        });

        score = secondPlayerDocSnap.data().score;
        score = score + 30;
        await updateDoc(secondPlayerDataRef, {
          score: score,
        });
      }
    } else if (chess.isDraw()) {
      // This condition assign score in case of a draw
      // Both player recieve 15 points
      let score = firstPlayerDocSnap.data().score;
      score = score + 15;
      await updateDoc(firstPlayerDataRef, {
        score: score,
      });

      score = secondPlayerDocSnap.data().score;
      score = score + 15;
      await updateDoc(secondPlayerDataRef, {
        score: score,
      });
    } else {
      let score = firstPlayerDocSnap.data().score;
      score = score - 10;
      await updateDoc(firstPlayerDataRef, {
        score: score,
      });

      score = secondPlayerDocSnap.data().score;
      score = score - 10;
      await updateDoc(secondPlayerDataRef, {
        score: score,
      });
    }

    await updateGameState(null, true);
    chess.reset();
  } else {
    chess.reset();
    updateGameState();
  }
}
