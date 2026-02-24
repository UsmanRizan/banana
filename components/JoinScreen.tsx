import React from "react";

interface JoinScreenProps {
  playerName: string;
  setPlayerName: (name: string) => void;
  onJoin: () => void;
}

const JoinScreen: React.FC<JoinScreenProps> = ({
  playerName,
  setPlayerName,
  onJoin,
}) => {
  return (
    <div className="min-h-screen bg-emerald-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-emerald-900 border-4 border-yellow-400 p-8 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bungee text-white mb-2 leading-tight">
            BANANA
            <br />
            FOOTBALL
          </h1>
          <p className="text-emerald-300">
            Solve Puzzles. Score Goals. Rule the Pitch.
          </p>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter Player Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full bg-emerald-800 border-2 border-emerald-600 rounded-xl p-4 text-white placeholder-emerald-500 focus:outline-none focus:border-yellow-400"
          />
          <button
            onClick={onJoin}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-emerald-950 font-bungee py-4 rounded-xl text-xl shadow-lg transition-all active:scale-95"
          >
            START GAME
          </button>
        </div>
        <div className="mt-8 text-xs text-emerald-400 text-center uppercase tracking-widest opacity-50">
          Single Player • 3 Min Match
        </div>
      </div>
    </div>
  );
};

export default JoinScreen;
