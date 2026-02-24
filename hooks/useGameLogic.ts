import { useState, useCallback } from "react";
import { ActionType, ActionConfig, MatchState, PlayerState } from "../types";
import { getMatchCommentary } from "../services/geminiService";

export const useGameLogic = (
  gameState: MatchState,
  setGameState: (fn: (prev: MatchState) => MatchState) => void,
  playerId: string,
) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [activeAction, setActiveAction] = useState<ActionConfig | null>(null);
  const [commentary, setCommentary] = useState(
    "Welcome to Banana Football! Let's play!",
  );

  const handleActionClick = useCallback((action: ActionConfig) => {
    setActiveAction(action);
  }, []);

  const handleScore = useCallback(async () => {
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

    const reaction = await getMatchCommentary("GOAL SCORED", `${score}`);
    setCommentary(reaction);

    // Reset Attack to Step 1
    setCurrentStep(1);
  }, [gameState.players, playerId, setGameState]);

  const onPuzzleComplete = useCallback(
    async (success: boolean) => {
      const actionType = activeAction?.type;
      setActiveAction(null);

      if (!success) {
        setCommentary("Attack broke down! Lost possession.");
        setCurrentStep(1);
        return;
      }

      // Determine next state based on current step and selected action
      if (actionType === ActionType.SHOOT) {
        await handleScore();
        return;
      }

      if (currentStep === 1) {
        if (actionType === ActionType.GROUND_PASS) {
          setCurrentStep(2);
          setCommentary("Safe pass into midfield. Building up...");
        } else if (actionType === ActionType.THROUGH_PASS) {
          setCurrentStep(3);
          setCommentary(
            "A piercing ball through the middle! We're in business.",
          );
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
    },
    [activeAction?.type, currentStep, handleScore],
  );

  return {
    currentStep,
    setCurrentStep,
    activeAction,
    setActiveAction,
    commentary,
    setCommentary,
    handleActionClick,
    onPuzzleComplete,
  };
};
