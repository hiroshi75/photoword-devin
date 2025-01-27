"use client";

import { useState, useEffect } from "react";
import { QuizCard } from "./QuizCard";
import { Button } from "@/components/ui/button";

interface Word {
  id: number;
  spanish: string;
  japanese: string;
  example: string;
  partOfSpeech: string;
}

interface QuizSectionProps {
  words: Word[];
}

export const QuizSection = ({ words }: QuizSectionProps) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [shuffledWords, setShuffledWords] = useState<Word[]>([]);

  useEffect(() => {
    // 単語をランダムに並び替え
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
  }, [words]);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentWordIndex === shuffledWords.length - 1) {
      setShowScore(true);
    }
  };

  const handleNext = () => {
    if (currentWordIndex < shuffledWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    }
  };

  const handleRestart = () => {
    setCurrentWordIndex(0);
    setScore(0);
    setShowScore(false);
    // 単語を再シャッフル
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
  };

  if (words.length === 0) {
    return (
      <div className="text-center p-4">
        <p>単語が登録されていません。</p>
      </div>
    );
  }

  if (showScore) {
    return (
      <div className="text-center p-4">
        <h2 className="text-2xl font-bold mb-4">クイズ結果</h2>
        <p className="text-xl mb-4">
          {words.length}問中{score}問正解！
        </p>
        <p className="text-lg mb-4">
          正答率: {Math.round((score / words.length) * 100)}%
        </p>
        <Button onClick={handleRestart}>もう一度チャレンジ</Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 text-center">
        <p className="text-lg">
          問題 {currentWordIndex + 1} / {words.length}
        </p>
        <p className="text-sm">現在のスコア: {score}</p>
      </div>
      <QuizCard
        word={shuffledWords[currentWordIndex]}
        onAnswer={handleAnswer}
      />
    </div>
  );
};
