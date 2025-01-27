import { S3Client } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";

// TODO: AWS S3の統合は後で実装
// const s3Client = new S3Client({
//   region: "us-east-1",
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//   },
// });

export async function uploadImage(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  
  // 画像の最適化
  // 画像フォーマットを自動検出して適切な形式で保存
  const image = sharp(buffer);
  const metadata = await image.metadata();
  
  let optimizedBuffer;
  if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
    optimizedBuffer = await image
      .resize(1024, 1024, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 80 })
      .toBuffer();
  } else if (metadata.format === 'png') {
    optimizedBuffer = await image
      .resize(1024, 1024, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .png({ quality: 80 })
      .toBuffer();
  } else {
    // その他のフォーマットはJPEGに変換
    optimizedBuffer = await image
      .resize(1024, 1024, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 80 })
      .toBuffer();
  }

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
