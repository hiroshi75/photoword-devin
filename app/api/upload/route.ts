import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { uploadImage } from '@/lib/s3';
import { analyzeImage } from '@/lib/image-analysis';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'ファイルがアップロードされていません' },
        { status: 400 }
      );
    }

    // 画像を保存
    const filePath = await uploadImage(file);

    // 画像を解析
    const analysisResult = await analyzeImage(file);

    // データベースに保存
    const photo = await prisma.photo.create({
      data: {
        filePath,
      },
    });

    return NextResponse.json({ 
      success: true,
      photo,
      analysis: analysisResult
    });
  } catch (error) {
    console.error('Upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'アップロードに失敗しました';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
