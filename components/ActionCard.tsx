import React from "react";
import { ActionType, ActionConfig } from "../types";

interface ActionCardProps {
  config: ActionConfig;
  risk: string;
  onClick: () => void;
  isSpecial?: boolean;
}

const ActionCard: React.FC<ActionCardProps> = ({
  config,
  risk,
  onClick,
  isSpecial,
}) => {
  const icon =
    config.type === ActionType.SHOOT
      ? "⚽"
      : config.type === ActionType.LOB_PASS
        ? "🚀"
        : config.type === ActionType.THROUGH_PASS
          ? "⚡"
          : "👟";

  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden transition-all transform hover:-translate-y-1 active:scale-95 text-left
        ${isSpecial ? "w-full md:w-full max-w-sm col-span-1 md:col-span-3" : "w-full"}
      `}
    >
      <div
        className={`h-full border-2 p-5 rounded-2xl flex flex-col gap-2 shadow-xl backdrop-blur-md
        ${
          isSpecial
            ? "bg-yellow-400 border-white text-emerald-950 animate-pulse"
            : "bg-emerald-900/80 border-emerald-700 text-white hover:border-yellow-400"
        }
      `}
      >
        <div className="flex justify-between items-start">
          <span className="text-3xl">{icon}</span>
          <span
            className={`text-[10px] font-bungee px-2 py-0.5 rounded border ${isSpecial ? "bg-emerald-950/10 border-emerald-950/20" : "bg-white/10 border-white/20"}`}
          >
            {risk}
          </span>
        </div>
        <div>
          <h3 className="font-bungee text-xl leading-none">{config.type}</h3>
          <p
            className={`text-xs mt-1 ${isSpecial ? "text-emerald-800" : "text-emerald-300"}`}
          >
            {config.difficulty} Difficulty
          </p>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div
            className={`flex-1 h-1.5 rounded-full ${isSpecial ? "bg-emerald-950/20" : "bg-emerald-950"}`}
          >
            <div
              className={`h-full rounded-full transition-all duration-500 ${isSpecial ? "bg-emerald-950" : "bg-yellow-400"}`}
              style={{ width: `${(config.timeLimit / 30) * 100}%` }}
            ></div>
          </div>
          <span className="text-xs font-bold font-bungee">
            {config.timeLimit}s
          </span>
        </div>
      </div>
    </button>
  );
};

export default ActionCard;
