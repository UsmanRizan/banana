
import { ActionType, Difficulty, ActionConfig } from './types';

export const MATCH_DURATION = 180; // 3 minutes
export const PUZZLES_PER_ACTION = 3;

export const ACTION_DEFS: Record<ActionType, Record<Difficulty, ActionConfig>> = {
  [ActionType.GROUND_PASS]: {
    [Difficulty.EASY]: { type: ActionType.GROUND_PASS, difficulty: Difficulty.EASY, timeLimit: 30 },
    [Difficulty.MEDIUM]: { type: ActionType.GROUND_PASS, difficulty: Difficulty.MEDIUM, timeLimit: 20 },
    [Difficulty.HARD]: { type: ActionType.GROUND_PASS, difficulty: Difficulty.HARD, timeLimit: 10 },
  },
  [ActionType.THROUGH_PASS]: {
    [Difficulty.EASY]: { type: ActionType.THROUGH_PASS, difficulty: Difficulty.EASY, timeLimit: 30 },
    [Difficulty.MEDIUM]: { type: ActionType.THROUGH_PASS, difficulty: Difficulty.MEDIUM, timeLimit: 20 },
    [Difficulty.HARD]: { type: ActionType.THROUGH_PASS, difficulty: Difficulty.HARD, timeLimit: 10 },
  },
  [ActionType.LOB_PASS]: {
    [Difficulty.EASY]: { type: ActionType.LOB_PASS, difficulty: Difficulty.EASY, timeLimit: 30 },
    [Difficulty.MEDIUM]: { type: ActionType.LOB_PASS, difficulty: Difficulty.MEDIUM, timeLimit: 20 },
    [Difficulty.HARD]: { type: ActionType.LOB_PASS, difficulty: Difficulty.HARD, timeLimit: 10 },
  },
  [ActionType.SHOOT]: {
    [Difficulty.EASY]: { type: ActionType.SHOOT, difficulty: Difficulty.EASY, timeLimit: 30 },
    [Difficulty.MEDIUM]: { type: ActionType.SHOOT, difficulty: Difficulty.MEDIUM, timeLimit: 20 },
    [Difficulty.HARD]: { type: ActionType.SHOOT, difficulty: Difficulty.HARD, timeLimit: 10 },
  },
};
