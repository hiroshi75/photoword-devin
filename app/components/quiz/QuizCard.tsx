"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Word {
  id: number;
  spanish: string;
  japanese: string;
  example: string;
  partOfSpeech: string;
}

interface QuizCardProps {
  word: Word;
  onAnswer: (isCorrect: boolean) => void;
}

export const QuizCard = ({ word, onAnswer }: QuizCardProps) => {
  const [answer, setAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    // 大文字小文字を区別せず、空白を削除して比較
    const isAnswerCorrect = answer.trim().toLowerCase() === word.spanish.trim().toLowerCase();
    setIsCorrect(isAnswerCorrect);
    setShowResult(true);
    onAnswer(isAnswerCorrect);
  };

  const handleNext = () => {
    setAnswer("");
    setShowResult(false);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2">スペイン語を入力してください：</h3>
        <p className="text-xl">{word.japanese}</p>
        {word.example && (
          <p className="text-sm text-gray-500 mt-2">
            ヒント: {word.example}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="スペイン語で回答"
          disabled={showResult}
        />

        {!showResult ? (
          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={!answer.trim()}
          >
            回答する
          </Button>
        ) : (
          <div className="space-y-4">
            <div
              className={`p-4 rounded-md ${
                isCorrect ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <p className="font-bold">
                {isCorrect ? "正解！" : "不正解"}
              </p>
              <p>正解: {word.spanish}</p>
            </div>
            <Button onClick={handleNext} className="w-full">
              次の問題へ
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
