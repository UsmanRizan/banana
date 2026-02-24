import { useEffect } from "react";
import { MatchState } from "../types";

export const useMatchTimer = (
  gameState: MatchState,
  setGameState: (fn: (prev: MatchState) => MatchState) => void,
) => {
  useEffect(() => {
    if (gameState.status !== "playing") return;

    const timer = setInterval(() => {
      setGameState((prev) => {
        if (prev.timeLeft <= 0) {
          clearInterval(timer);
          return { ...prev, status: "finished", timeLeft: 0 };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.status, setGameState]);
};
