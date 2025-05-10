import axios from "axios";
import sharp from "sharp";
import NodeCache from "node-cache";
import fs from "fs/promises";
import { imageTransforme } from "types";

const imageCache = new NodeCache({ stdTTL: 3600 });

export async function getImageInfoAndBase64(url: string): Promise<imageTransforme> {
  const cached = imageCache.get(url);
  if (cached) return cached as imageTransforme;

  // 1. Baixa a imagem original
  const response = await axios.get(url, { responseType: "arraybuffer" });
  const originalBuffer = Buffer.from(response.data);

  // 2. Redimensiona imagem original
  const resizedImage = sharp(originalBuffer).resize({ width: 400 }).webp({ quality: 50 });
  const resizedBuffer = await resizedImage.toBuffer();
  const { width, height, format } = await sharp(resizedBuffer).metadata();

  // 3. Carrega e redimensiona a marca d'água para cobrir a imagem inteira
  const watermarkOriginal = await fs.readFile("watermark.webp");
  const resizedWatermark = await sharp(watermarkOriginal)
    .resize(width, height, { fit: "cover" })
    .toBuffer();

  // 4. Aplica a marca d'água por cima
  const finalImageBuffer = await sharp(resizedBuffer)
    .composite([
      {
        input: resizedWatermark,
        blend: "multiply", // ou 'soft-light', 'multiply', 'overlay', etc.
      },
    ])
    .toBuffer();

  // 5. Retorna resultado com base64
  const result = {
    width,
    height,
    format,
    base64: `data:image/${format};base64,${finalImageBuffer.toString("base64")}`,
  };

  imageCache.set(url, result);
  return result;
}
