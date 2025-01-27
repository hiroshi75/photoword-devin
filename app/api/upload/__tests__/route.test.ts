import { NextRequest } from 'next/server';
import { POST } from '../route';
import { analyzeImage } from '@/lib/image-analysis';
import path from 'path';
import fs from 'fs/promises';

jest.mock('@/lib/image-analysis');

describe('Upload API Route', () => {
  it('should analyze restaurant image correctly', async () => {
    // モックの設定
    const mockAnalyzeImage = analyzeImage as jest.MockedFunction<typeof analyzeImage>;
    mockAnalyzeImage.mockResolvedValue('テーブル、椅子、窓があるレストランの内装です。');

    // テスト画像の読み込み
    const imagePath = path.join(process.cwd(), 'test_image', 'test1_restaurant.jpg');
    const imageBuffer = await fs.readFile(imagePath);
    const imageFile = new File([imageBuffer], 'test1_restaurant.jpg', { type: 'image/jpeg' });

    // FormDataの作成
    const formData = new FormData();
    formData.append('file', imageFile);

    // リクエストの作成
    const request = new NextRequest('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData,
    });

    // APIの実行
    const response = await POST(request);
    const data = await response.json();

    // レスポンスの検証
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.analysis).toContain('レストラン');
    expect(mockAnalyzeImage).toHaveBeenCalled();
  });
});
