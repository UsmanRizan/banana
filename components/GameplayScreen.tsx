import React from "react";
import { MatchState, ActionConfig, PlayerState } from "../types";
import PuzzleModal from "./PuzzleModal";
import ActionCard from "./ActionCard";

interface GameplayScreenProps {
  gameState: MatchState;
  playerId: string;
  currentStep: number;
  activeAction: ActionConfig | null;
  commentary: string;
  currentOptions: any[];
  onActionClick: (action: ActionConfig) => void;
  onPuzzleComplete: (success: boolean) => void;
  onCloseModal: () => void;
}

const GameplayScreen: React.FC<GameplayScreenProps> = ({
  gameState,
  playerId,
  currentStep,
  activeAction,
  commentary,
  currentOptions,
  onActionClick,
  onPuzzleComplete,
  onCloseModal,
}) => {
  const myData = gameState.players[playerId] as PlayerState;

  const getPhaseLabel = () => {
    switch (currentStep) {
      case 1:
        return "Phase 1: Initiation";
      case 4:
        return "Phase 4: Final Strike";
      default:
        return `Phase ${currentStep}: Build Up`;
    }
  };

  return (
    <div className="h-screen bg-emerald-950 flex flex-col overflow-hidden select-none">
      {/* HUD - Score & Timer */}
      <div className="bg-emerald-900 border-b-4 border-yellow-400 px-4 py-3 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-800 px-4 py-2 rounded-lg border border-emerald-700">
            <div className="text-[10px] text-emerald-400 uppercase font-bold">
              PLAYER
            </div>
            <div className="text-2xl font-bungee text-white leading-none">
              {myData.name}
            </div>
          </div>
          <div className="text-4xl font-bungee text-white">{myData.goals}</div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="bg-yellow-400 text-emerald-950 font-bungee px-6 py-2 rounded-full text-2xl shadow-lg border-2 border-white min-w-[120px] text-center">
            {Math.floor(gameState.timeLeft / 60)}:
            {(gameState.timeLeft % 60).toString().padStart(2, "0")}
          </div>
        </div>
      </div>

      {/* Main Pitch View */}
      <div className="flex-1 relative pitch-pattern overflow-hidden flex flex-col">
        {/* Commentator Box */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 z-10">
          <div className="bg-black/60 backdrop-blur-md border border-white/20 p-3 rounded-xl text-center shadow-lg">
            <p className="text-emerald-100 text-sm md:text-base italic leading-relaxed">
              "{commentary}"
            </p>
          </div>
        </div>

        {/* Action Center */}
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-2xl space-y-6">
            <div className="text-center">
              <span className="inline-block bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 px-4 py-1 rounded-full text-xs font-bungee uppercase tracking-widest mb-4">
                {getPhaseLabel()}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center">
              {currentOptions.map((opt, idx) => (
                <ActionCard
                  key={`${currentStep}-${idx}`}
                  config={opt}
                  risk={opt.risk || ""}
                  isSpecial={opt.isSpecial}
                  onClick={() => onActionClick(opt)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Pitch Lines Decoration */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-4 border-white rounded-full"></div>
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-white"></div>
        </div>
      </div>

      {/* Puzzles Modal */}
      {activeAction && (
        <PuzzleModal
          difficulty={activeAction.difficulty}
          timeLimit={activeAction.timeLimit}
          globalTimeLeft={gameState.timeLeft}
          onComplete={onPuzzleComplete}
          onClose={onCloseModal}
        />
      )}
    </div>
  );
};

export default GameplayScreen;
