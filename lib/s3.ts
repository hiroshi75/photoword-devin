import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";

const s3Client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadImage(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  
  // 画像の最適化
  const optimizedBuffer = await sharp(buffer)
    .resize(1024, 1024, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: 80 })
    .toBuffer();

  // 一時的にpublicディレクトリに保存
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = `/uploads/${fileName}`;
  const fullPath = path.join(process.cwd(), 'public', filePath);
  
  // ディレクトリが存在することを確認
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  
  // ファイルを保存
  await fs.writeFile(fullPath, optimizedBuffer);
  
  return filePath;
}
