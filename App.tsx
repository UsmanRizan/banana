import React from "react";
import { useGameState } from "./hooks/useGameState";
import { useMatchTimer } from "./hooks/useMatchTimer";
import { useGameLogic } from "./hooks/useGameLogic";
import { useActionOptions } from "./hooks/useActionOptions";
import JoinScreen from "./components/JoinScreen";
import FinishedScreen from "./components/FinishedScreen";
import GameplayScreen from "./components/GameplayScreen";

const App: React.FC = () => {
  // Game State Management
  const {
    playerId,
    playerName,
    setPlayerName,
    isJoined,
    gameState,
    setGameState,
    joinMatch,
  } = useGameState();

  // Match Timer
  useMatchTimer(gameState, setGameState);

  // Game Logic & State Machine
  const {
    currentStep,
    activeAction,
    commentary,
    handleActionClick,
    onPuzzleComplete,
    setActiveAction,
  } = useGameLogic(gameState, setGameState, playerId);

  // Action Options for Current Step
  const currentOptions = useActionOptions(currentStep);

  const myData = gameState.players[playerId];

  // Render appropriate screen based on game state
  if (!isJoined) {
    return (
      <JoinScreen
        playerName={playerName}
        setPlayerName={setPlayerName}
        onJoin={joinMatch}
      />
    );
  }

  if (gameState.status === "finished") {
    return <FinishedScreen playerData={myData} />;
  }

  return (
    <GameplayScreen
      gameState={gameState}
      playerId={playerId}
      currentStep={currentStep}
      activeAction={activeAction}
      commentary={commentary}
      currentOptions={currentOptions}
      onActionClick={handleActionClick}
      onPuzzleComplete={onPuzzleComplete}
      onCloseModal={() => setActiveAction(null)}
    />
  );
};

export default App;
