import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  ActionType,
  Difficulty,
  ActionConfig,
  PlayerState,
  MatchState,
  GameMessage,
} from "./types";
import { ACTION_DEFS, MATCH_DURATION } from "./constants";
import { MultiplayerManager } from "./services/multiplayerManager";
import { getMatchCommentary } from "./services/geminiService";
import PuzzleModal from "./components/PuzzleModal";

const App: React.FC = () => {
  const [playerId] = useState(
    () => "player_" + Math.random().toString(36).substr(2, 9),
  );
  const [playerName, setPlayerName] = useState("");
  const [gameState, setGameState] = useState<MatchState>({
    id: "match_1",
    startTime: null,
    timeLeft: MATCH_DURATION,
    players: {},
    status: "waiting",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [activeAction, setActiveAction] = useState<ActionConfig | null>(null);
  const [commentary, setCommentary] = useState(
    "Welcome to Banana Football! Waiting for opponent...",
  );
  const [isJoined, setIsJoined] = useState(false);

  // Initialize Multiplayer Manager
  const handleRemoteMessage = useCallback((msg: GameMessage) => {
    switch (msg.type) {
      case "PLAYER_JOIN":
        setGameState((prev) => {
          const newPlayers = {
            ...prev.players,
            [msg.senderId]: msg.payload as PlayerState,
          };
          const shouldStart =
            Object.keys(newPlayers).length >= 2 && prev.status === "waiting";

          return {
            ...prev,
            players: newPlayers,
            status: shouldStart ? "playing" : prev.status,
            startTime: shouldStart ? Date.now() : prev.startTime,
            timeLeft: shouldStart ? MATCH_DURATION : prev.timeLeft,
          };
        });
        break;
      case "SYNC_STATE":
        setGameState(msg.payload as MatchState);
        break;
      case "UPDATE_SCORE":
        setGameState((prev) => ({
          ...prev,
          players: {
            ...prev.players,
            [msg.senderId]: {
              ...(prev.players[msg.senderId] as PlayerState),
              goals: msg.payload as number,
            },
          },
        }));
        break;
      case "MATCH_START":
        setGameState((prev) => ({
          ...prev,
          status: "playing",
          startTime: Date.now(),
          timeLeft: MATCH_DURATION,
        }));
        break;
    }
  }, []);

  const multiplayer = useMemo(
    () => new MultiplayerManager(playerId, handleRemoteMessage),
    [playerId, handleRemoteMessage],
  );

  // Auto-start game when both players joined
  useEffect(() => {
    if (
      isJoined &&
      Object.keys(gameState.players).length >= 2 &&
      gameState.status === "waiting"
    ) {
      multiplayer.sendMessage("MATCH_START", null);
      setGameState((prev) => ({
        ...prev,
        status: "playing",
        startTime: Date.now(),
        timeLeft: MATCH_DURATION,
      }));
    }
  }, [isJoined, gameState.players, gameState.status, multiplayer]);

  // Global Match Timer
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
  }, [gameState.status]);

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
      const newState: MatchState = {
        ...prev,
        players: newPlayers,
        status: "waiting",
      };

      // Always send PLAYER_JOIN; the remote handler will detect when 2 players are present
      multiplayer.sendMessage("PLAYER_JOIN", initialPlayer);

      return newState;
    });

    setIsJoined(true);
  };

  const handleActionClick = (action: ActionConfig) => {
    setActiveAction(action);
  };

  /**
   * CORE STATE MACHINE LOGIC
   * Implements the logic based on the user's "Compact Full Transition Table"
   */
  const onPuzzleComplete = async (success: boolean) => {
    const actionType = activeAction?.type;
    const diff = activeAction?.difficulty;
    setActiveAction(null);

    if (!success) {
      setCommentary("Attack broke down! Lost possession.");
      setCurrentStep(1);
      return;
    }

    // Determine next state based on current step and selected action
    if (actionType === ActionType.SHOOT) {
      handleScore();
      return;
    }

    if (currentStep === 1) {
      if (actionType === ActionType.GROUND_PASS) {
        setCurrentStep(2);
        setCommentary("Safe pass into midfield. Building up...");
      } else if (actionType === ActionType.THROUGH_PASS) {
        setCurrentStep(3);
        setCommentary("A piercing ball through the middle! We're in business.");
      } else if (actionType === ActionType.LOB_PASS) {
        setCurrentStep(4);
        setCommentary("WHAT A BALL! Direct to the target man!");
      }
    } else if (currentStep === 2) {
      if (actionType === ActionType.THROUGH_PASS) {
        setCurrentStep(3);
        setCommentary("Great movement off the ball. Advancing!");
      } else if (actionType === ActionType.LOB_PASS) {
        setCurrentStep(4);
        setCommentary("Over the top! The defense is scrambled.");
      }
    } else if (currentStep === 3) {
      if (actionType === ActionType.LOB_PASS) {
        setCurrentStep(4);
        setCommentary("Last man beaten! Get ready to finish!");
      }
    }
  };

  const handleScore = async () => {
    const currentPlayer = gameState.players[playerId] as PlayerState;
    const score = currentPlayer.goals + 1;

    setGameState((prev) => ({
      ...prev,
      players: {
        ...prev.players,
        [playerId]: {
          ...(prev.players[playerId] as PlayerState),
          goals: score,
        },
      },
    }));
    multiplayer.sendMessage("UPDATE_SCORE", score);

    const opponentId = Object.keys(gameState.players).find(
      (id) => id !== playerId,
    );
    const opponentGoals = opponentId
      ? (gameState.players[opponentId] as PlayerState).goals
      : 0;

    const reaction = await getMatchCommentary(
      "GOAL SCORED",
      `${score}-${opponentGoals}`,
    );
    setCommentary(reaction);

    // Reset Attack to Step 1
    setCurrentStep(1);
  };

  /**
   * DYNAMIC ACTION OPTIONS GENERATOR
   * Based on the user's requirements:
   * Step 1: 1(E), 2(M), 3(H)
   * Step 2: 2(E), 3(M), 4(H)
   * Step 3: 3(E), 4(M)
   * Step 4: 4(E)
   * Fix: Added isSpecial: false to non-special items to fix union property access in map.
   */
  const currentOptions = useMemo(() => {
    switch (currentStep) {
      case 1:
        return [
          {
            ...ACTION_DEFS[ActionType.GROUND_PASS][Difficulty.EASY],
            risk: "LOW",
            isSpecial: false,
          },
          {
            ...ACTION_DEFS[ActionType.THROUGH_PASS][Difficulty.MEDIUM],
            risk: "MEDIUM",
            isSpecial: false,
          },
          {
            ...ACTION_DEFS[ActionType.LOB_PASS][Difficulty.HARD],
            risk: "HIGH",
            isSpecial: false,
          },
        ];
      case 2:
        return [
          {
            ...ACTION_DEFS[ActionType.THROUGH_PASS][Difficulty.EASY],
            risk: "STEADY",
            isSpecial: false,
          },
          {
            ...ACTION_DEFS[ActionType.LOB_PASS][Difficulty.MEDIUM],
            risk: "BOLD",
            isSpecial: false,
          },
          {
            ...ACTION_DEFS[ActionType.SHOOT][Difficulty.HARD],
            risk: "GOAL CHANCE",
            isSpecial: true,
          },
        ];
      case 3:
        return [
          {
            ...ACTION_DEFS[ActionType.LOB_PASS][Difficulty.EASY],
            risk: "FINAL PASS",
            isSpecial: false,
          },
          {
            ...ACTION_DEFS[ActionType.SHOOT][Difficulty.MEDIUM],
            risk: "CLOSE RANGE",
            isSpecial: true,
          },
        ];
      case 4:
        return [
          {
            ...ACTION_DEFS[ActionType.SHOOT][Difficulty.EASY],
            risk: "POINTER RANGE",
            isSpecial: true,
          },
        ];
      default:
        return [];
    }
  }, [currentStep]);

  const opponent = Object.values(gameState.players).find(
    (p): p is PlayerState => (p as PlayerState).id !== playerId,
  );
  const myData = gameState.players[playerId] as PlayerState;

  if (!isJoined) {
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
              onClick={joinMatch}
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-emerald-950 font-bungee py-4 rounded-xl text-xl shadow-lg transition-all active:scale-95"
            >
              FIND MATCH
            </button>
          </div>
          <div className="mt-8 text-xs text-emerald-400 text-center uppercase tracking-widest opacity-50">
            Real-time Multiplayer • 3 Min Matches
          </div>
        </div>
      </div>
    );
  }

  if (gameState.status === "finished") {
    const myGoals = myData.goals;
    const oppGoals = opponent?.goals || 0;
    let result = "DRAW";
    let color = "text-yellow-400";
    if (myGoals > oppGoals) {
      result = "VICTORY";
      color = "text-green-400";
    } else if (myGoals < oppGoals) {
      result = "DEFEAT";
      color = "text-red-400";
    }

    return (
      <div className="min-h-screen bg-emerald-950 flex flex-col items-center justify-center p-4">
        <h1 className="text-6xl font-bungee text-white mb-8">MATCH ENDED</h1>
        <div className="bg-emerald-900 border-4 border-yellow-400 p-12 rounded-3xl shadow-2xl text-center max-w-xl w-full">
          <div className={`text-7xl font-bungee mb-4 ${color}`}>{result}</div>
          <div className="flex justify-around items-center mb-8">
            <div className="text-center">
              <div className="text-emerald-300 uppercase text-sm mb-1">
                {myData.name}
              </div>
              <div className="text-6xl font-bungee text-white">{myGoals}</div>
            </div>
            <div className="text-4xl font-bungee text-yellow-400 opacity-50">
              -
            </div>
            <div className="text-center">
              <div className="text-emerald-300 uppercase text-sm mb-1">
                {opponent?.name || "CPU"}
              </div>
              <div className="text-6xl font-bungee text-white">{oppGoals}</div>
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
  }

  return (
    <div className="h-screen bg-emerald-950 flex flex-col overflow-hidden select-none">
      {/* HUD - Score & Timer */}
      <div className="bg-emerald-900 border-b-4 border-yellow-400 px-4 py-3 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-800 px-4 py-2 rounded-lg border border-emerald-700">
            <div className="text-[10px] text-emerald-400 uppercase font-bold">
              HOME
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

        <div className="flex items-center gap-3">
          <div className="text-4xl font-bungee text-white">
            {opponent?.goals || 0}
          </div>
          <div className="bg-emerald-800 px-4 py-2 rounded-lg border border-emerald-700 text-right">
            <div className="text-[10px] text-emerald-400 uppercase font-bold">
              AWAY
            </div>
            <div className="text-2xl font-bungee text-white leading-none">
              {opponent?.name || "..."}
            </div>
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
                {currentStep === 1
                  ? "Phase 1: Initiation"
                  : currentStep === 4
                    ? "Phase 4: Final Strike"
                    : `Phase ${currentStep}: Build Up`}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center">
              {currentOptions.map((opt, idx) => (
                <ActionCard
                  key={`${currentStep}-${idx}`}
                  config={opt}
                  risk={opt.risk || ""}
                  isSpecial={opt.isSpecial}
                  onClick={() => handleActionClick(opt)}
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
          onClose={() => setActiveAction(null)}
        />
      )}
    </div>
  );
};

const ActionCard: React.FC<{
  config: ActionConfig;
  risk: string;
  onClick: () => void;
  isSpecial?: boolean;
}> = ({ config, risk, onClick, isSpecial }) => {
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

export default App;
