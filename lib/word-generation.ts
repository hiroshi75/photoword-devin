import { ChatBedrock } from "@langchain/community/chat_models/bedrock";
import { HumanMessage } from "@langchain/core/messages";

interface GeneratedWord {
  spanish: string;
  japanese: string;
  example: string;
  partOfSpeech: string;
}

const llm = new ChatBedrock({
  model: "anthropic.claude-3-haiku-20240307-v1:0",
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  modelKwargs: {
    temperature: 0,
  },
});

export async function generateWords(imageDescription: string): Promise<GeneratedWord[]> {
  try {
    const prompt = `
画像の説明文から、スペイン語学習に適した単語を抽出してください。
以下の形式でJSONを生成してください：

{
  "words": [
    {
      "spanish": "スペイン語",
      "japanese": "日本語訳",
      "example": "スペイン語の例文",
      "partOfSpeech": "品詞"
    }
  ]
}

画像の説明文：
${imageDescription}

注意点：
- 単語は3-5個程度
- 品詞は名詞、動詞、形容詞のいずれか
- 例文は簡単で実用的なものを選択
- 初級学習者向けの基本的な単語を優先
`;

    const response = await llm.invoke([
      new HumanMessage({
        content: prompt,
      }),
    ]);

    const result = JSON.parse(response.content as string);
    return result.words;
  } catch (error) {
    console.error("Word generation error:", error);
    throw new Error("単語の生成に失敗しました");
  }
}
