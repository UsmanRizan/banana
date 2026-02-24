import React from "react";
import { PlayerState } from "../types";

interface FinishedScreenProps {
  playerData: PlayerState;
}

const FinishedScreen: React.FC<FinishedScreenProps> = ({ playerData }) => {
  return (
    <div className="min-h-screen bg-emerald-950 flex flex-col items-center justify-center p-4">
      <h1 className="text-6xl font-bungee text-white mb-8">MATCH ENDED</h1>
      <div className="bg-emerald-900 border-4 border-yellow-400 p-12 rounded-3xl shadow-2xl text-center max-w-xl w-full">
        <div className="text-emerald-300 uppercase text-sm mb-6">
          Final Score
        </div>
        <div className="text-center mb-8">
          <div className="text-emerald-300 uppercase text-sm mb-2">
            {playerData.name}
          </div>
          <div className="text-7xl font-bungee text-white">
            {playerData.goals}
          </div>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-white hover:bg-emerald-100 text-emerald-950 font-bungee px-8 py-4 rounded-xl text-xl transition-all"
        >
          PLAY AGAIN
        </button>
      </div>
    </div>
  );
};

export default FinishedScreen;
