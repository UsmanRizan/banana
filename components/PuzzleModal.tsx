import React, { useState, useEffect, useRef } from "react";
import { BananaPuzzle, Difficulty } from "../types";
import { fetchBananaPuzzles } from "../services/bananaApiService";

interface PuzzleModalProps {
  difficulty: Difficulty;
  timeLimit: number;
  globalTimeLeft: number;
  onComplete: (success: boolean) => void;
  onClose: () => void;
}

const PuzzleModal: React.FC<PuzzleModalProps> = ({
  difficulty,
  timeLimit,
  globalTimeLeft,
  onComplete,
  onClose,
}) => {
  const [puzzles, setPuzzles] = useState<BananaPuzzle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeStartedRef = useRef(Date.now());

  useEffect(() => {
    async function load() {
      // We fetch a fixed number of puzzles (3) as per original logic
      const data = await fetchBananaPuzzles(3);
      setPuzzles(data);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    // If global time ran out, fail the puzzle
    if (globalTimeLeft <= 0) {
      onComplete(false);
    }
  }, [globalTimeLeft, onComplete]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const current = puzzles[currentIndex];
    if (parseInt(input) === current.solution) {
      if (currentIndex === puzzles.length - 1) {
        onComplete(true);
      } else {
        setCurrentIndex((prev) => prev + 1);
        setInput("");
      }
    } else {
      // Wrong answer - clear input
      setInput("");
    }
  };

  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading, currentIndex]);

  const elapsedMs = Date.now() - timeStartedRef.current;
  const elapsedSeconds = Math.floor(elapsedMs / 1000);
  const remainingActionTime = Math.max(0, timeLimit - elapsedSeconds);

  // Fail if exceeded action time limit or global time ran out
  useEffect(() => {
    if (!loading && (elapsedSeconds > timeLimit || globalTimeLeft <= 0)) {
      onComplete(false);
    }
  }, [elapsedSeconds, timeLimit, globalTimeLeft, onComplete, loading]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-emerald-900 border-4 border-yellow-400 p-8 rounded-2xl text-center max-w-md w-full shadow-2xl">
          <div className="animate-bounce mb-4 text-4xl">🍌</div>
          <h2 className="text-2xl font-bungee text-white mb-2">
            Fetching Banana Puzzles...
          </h2>
          <p className="text-emerald-200">
            The referee is checking the VAR (Virtual Answer Reality)
          </p>
        </div>
      </div>
    );
  }

  const currentPuzzle = puzzles[currentIndex];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-emerald-900 border-4 border-yellow-400 p-6 rounded-2xl text-center max-w-xl w-full shadow-2xl relative overflow-hidden">
        {/* Timer Bar */}
        <div
          className="absolute top-0 left-0 h-2 bg-yellow-400 transition-all duration-1000"
          style={{ width: `${(remainingActionTime / timeLimit) * 100}%` }}
        ></div>

        <div className="flex justify-between items-center mb-4">
          <span className="text-yellow-400 font-bungee">
            Puzzle {currentIndex + 1} of 3
          </span>
          <span
            className={`font-bungee text-2xl ${remainingActionTime < 5 ? "text-red-500 animate-pulse" : "text-white"}`}
          >
            {remainingActionTime}s / {globalTimeLeft}s
          </span>
        </div>

        <div className="bg-white p-2 rounded-xl border-4 border-emerald-700 mb-6 flex items-center justify-center min-h-[200px]">
          <img
            src={currentPuzzle.question}
            alt="Banana Math Puzzle"
            className="max-w-full max-h-[300px] object-contain rounded-lg"
            referrerPolicy="no-referrer"
          />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="number"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-emerald-950 border-2 border-emerald-600 rounded-lg p-4 text-3xl text-center text-yellow-400 focus:outline-none focus:border-yellow-400 transition-colors"
              placeholder="?"
              required
            />
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-300 text-emerald-950 font-bungee px-8 rounded-xl text-xl shadow-lg transform active:scale-95 transition-all"
            >
              GO!
            </button>
          </div>
        </form>

        <button
          onClick={onClose}
          className="mt-4 text-emerald-300 underline hover:text-emerald-100 transition-colors text-sm"
        >
          Cancel Attack
        </button>
      </div>
    </div>
  );
};

export default PuzzleModal;
