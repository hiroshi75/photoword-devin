"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export const UploadArea = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setAnalysisResult(null);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('アップロードに失敗しました');
      }

      const data = await response.json();
      console.log('Upload successful:', data);
      setAnalysisResult(data.analysis);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('アップロードに失敗しました。もう一度お試しください。');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'}`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div className="relative w-full aspect-video">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <div>
            <p className="text-lg mb-2">
              {isDragActive
                ? '画像をドロップしてください'
                : '画像をドラッグ&ドロップするか、クリックして選択してください'}
            </p>
            <p className="text-sm text-gray-500">
              対応形式: JPG, JPEG, PNG
            </p>
          </div>
        )}
      </div>
      {preview && (
        <div className="mt-4 flex flex-col items-center gap-4">
          <Button 
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? 'アップロード中...' : 'アップロード'}
          </Button>
          {error && (
            <p className="text-red-500">{error}</p>
          )}
          {analysisResult && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-bold mb-2">画像分析結果:</h3>
              <p>{analysisResult}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
