import cloudflareApi from 'apis/cloudflare';
import cloudinaryApi from 'apis/cloudinary';
import { randomUUID } from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import { image } from 'types';
import getBase64ImageUrl from 'utils/generateBlurPlaceholder';
import { getImageInfoAndBase64 } from 'utils/image';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const { location, icf, nextCursor } = req.query;
  try {
    res.status(200).json(await findImgs(location as string, icf == "true", nextCursor as string));
  } catch (error) {
    console.error('Erro na API interna:', (error as Error).message);
    res.status(500).json({ error: 'Erro ao buscar dados da API externa' });
  }
}

async function getCloudinary(id: string) {
  let results = await cloudinaryApi.getAllImagesByFolder(id)

  let reducedResults: image[] = results?.resources.map((result) => ({
    id: result.asset_id,
    height: result.height,
    width: result.width,
    public_id: result.public_id,
    format: result.format
  }))

  const blurImagePromises = results?.resources?.map((image) =>
    getBase64ImageUrl(image as unknown as image)
  )
  const imagesWithBlurDataUrls = await Promise.all(blurImagePromises)

  for (let i = 0; i < reducedResults.length; i++) {
    reducedResults[i].blurDataUrl = imagesWithBlurDataUrls[i]
  }

  return reducedResults;
}

async function getCloudflare(id: string, nextCursor: string | null = null) {
  const response = await cloudflareApi.getAllImagesByFolder(id, nextCursor ?? '');
  let result = {
    data: [],
    nextCursor: response.data.nextCursor ?? null
  }
  result.data = await Promise.all(
    response.data.imgs.map(async (img) => {
      const { height, width, base64 } = await getImageInfoAndBase64(img.url);
      const id = randomUUID()
      const public_id = img.key

      return {
        base64,
        height,
        width,
        id,
        public_id
      };
    })
  );
  return result;
}

export async function findImgs(location: string, icf: boolean, nextCursor: string | null = null) {
  let result: any;
  if (!icf)
    result = await getCloudinary(location);
  else if (icf)
    result = await getCloudflare(location, nextCursor);
  return result;
}