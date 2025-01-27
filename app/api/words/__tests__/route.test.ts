import { NextRequest, NextResponse } from 'next/server';
import { POST } from '../route';
import { generateWords } from '@/lib/word-generation';

jest.mock('@/lib/word-generation');

describe('Words API Route', () => {
  it('should generate words from image description', async () => {
    // モックの設定
    const mockGenerateWords = generateWords as jest.MockedFunction<typeof generateWords>;
    mockGenerateWords.mockResolvedValue([
      {
        spanish: 'mesa',
        japanese: '[名詞]テーブル',
        example: 'La mesa es grande.',
        partOfSpeech: '名詞',
      },
      {
        spanish: 'silla',
        japanese: '[名詞]椅子',
        example: 'La silla es cómoda.',
        partOfSpeech: '名詞',
      },
    ]);

    // リクエストの作成
    const request = new NextRequest('http://localhost:3000/api/words', {
      method: 'POST',
      body: JSON.stringify({
        photoId: 1,
        imageDescription: 'テーブルと椅子があるレストランの内装です。',
      }),
    });

    // APIの実行
    const response = await POST(request);
    const data = await response.json();

    // レスポンスの検証
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.words).toHaveLength(2);
    expect(data.words[0].spanish).toBe('mesa');
    expect(data.words[0].japanese).toBe('[名詞]テーブル');
    expect(mockGenerateWords).toHaveBeenCalled();
  });
});
