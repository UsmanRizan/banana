import { useMemo } from "react";
import { ActionType, Difficulty } from "../types";
import { ACTION_DEFS } from "../constants";

export const useActionOptions = (currentStep: number) => {
  return useMemo(() => {
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
};
