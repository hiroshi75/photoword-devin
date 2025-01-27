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

interface WordListProps {
  photoId: number;
  imageDescription: string;
}

export const WordList = ({ photoId, imageDescription }: WordListProps) => {
  const [words, setWords] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateWords = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/words", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ photoId, imageDescription }),
      });

      if (!response.ok) {
        throw new Error("単語の生成に失敗しました");
      }

      const data = await response.json();
      setWords(data.words);
    } catch (error) {
      console.error("Error generating words:", error);
      setError("単語の生成に失敗しました。もう一度お試しください。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">単語リスト</h2>
        <Button
          onClick={generateWords}
          disabled={isLoading}
        >
          {isLoading ? "生成中..." : "単語を生成"}
        </Button>
      </div>

      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      {words.length > 0 && (
        <div className="space-y-4">
          {words.map((word) => (
            <div
              key={word.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold">{word.spanish}</h3>
                  <p className="text-gray-600">[{word.partOfSpeech}]{word.japanese}</p>
                </div>
              </div>
              {word.example && (
                <p className="text-sm text-gray-500 mt-2">
                  例文: {word.example}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
