import { useState } from "react";
import { MatchState, PlayerState } from "../types";
import { MATCH_DURATION } from "../constants";

export const useGameState = () => {
  const [playerId] = useState(
    () => "player_" + Math.random().toString(36).substr(2, 9),
  );
  const [playerName, setPlayerName] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [gameState, setGameState] = useState<MatchState>({
    id: "match_1",
    startTime: null,
    timeLeft: MATCH_DURATION,
    players: {},
    status: "waiting",
  });

  const joinMatch = () => {
    if (!playerName.trim()) return;

    const initialPlayer: PlayerState = {
      id: playerId,
      name: playerName,
      goals: 0,
      currentStep: 1,
      currentAction: null,
      lastStepResult: null,
      points: 0,
    };

    setGameState((prev) => {
      const newPlayers = { ...prev.players, [playerId]: initialPlayer };
      return {
        ...prev,
        players: newPlayers,
        status: "playing",
        startTime: Date.now(),
        timeLeft: MATCH_DURATION,
      };
    });

    setIsJoined(true);
  };

  return {
    playerId,
    playerName,
    setPlayerName,
    isJoined,
    gameState,
    setGameState,
    joinMatch,
  };
};
