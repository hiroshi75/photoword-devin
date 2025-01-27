import { ChatBedrock } from "@langchain/community/chat_models/bedrock";
import { HumanMessage } from "@langchain/core/messages";

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

export async function analyzeImage(imageUrl: string) {
  try {
    const response = await llm.invoke([
      new HumanMessage({
        content: [
          {
            type: "image_url",
            image_url: imageUrl,
          },
          {
            type: "text",
            text: "この画像に写っているものを日本語で説明してください。主要な物体や特徴を3-5個程度リストアップしてください。",
          },
        ],
      }),
    ]);

    return response.content;
  } catch (error) {
    console.error("Image analysis error:", error);
    throw new Error("画像の解析に失敗しました");
  }
}
