
export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

export enum ActionType {
  GROUND_PASS = 'Ground Pass',
  THROUGH_PASS = 'Through Pass',
  LOB_PASS = 'Lob Pass',
  SHOOT = 'Shoot'
}

// ActionConfig now includes optional metadata for UI risk display and special styling
export interface ActionConfig {
  type: ActionType;
  difficulty: Difficulty;
  timeLimit: number;
  risk?: string;
  isSpecial?: boolean;
}

export interface PlayerState {
  id: string;
  name: string;
  goals: number;
  currentStep: number;
  currentAction: ActionConfig | null;
  lastStepResult: 'success' | 'failure' | null;
  points: number;
}

export interface MatchState {
  id: string;
  startTime: number | null;
  timeLeft: number;
  players: Record<string, PlayerState>;
  status: 'waiting' | 'playing' | 'finished';
}

export interface BananaPuzzle {
  question: string; // This will be the image URL from the API
  solution: number; // The numerical answer
}

export type MessageType = 'PLAYER_JOIN' | 'UPDATE_SCORE' | 'MATCH_START' | 'SYNC_STATE';

export interface GameMessage {
  type: MessageType;
  payload: any;
  senderId: string;
}
