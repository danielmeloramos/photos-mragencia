import type { NextApiRequest, NextApiResponse } from 'next';
import cloudflareApi from 'apis/cloudflare';
import cloudinaryApi from 'apis/cloudinary';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let result = [];

    if (process.env.ENABLE_CLOUDINARY == "true") {
      try {
        const resultCloudinary = await cloudinaryApi.getFolders()
        result.push(...await Promise.all(
          resultCloudinary.folders.map(async x => {
            return {
              name: x.name,
              lastUpdate: await cloudinaryApi.getLastFolderAlteration(x.name),
              render: 'cdy'
            };
          })
        ));
      }
      catch (e) { }
    }

    if (process.env.ENABLE_CLOUDFLARE == "true") {
      try {
        const resultCloudflare = await cloudflareApi.getFolders();
        result.push(...await Promise.all(
          resultCloudflare.data.map(async x => {
            return {
              name: x,
              lastUpdate: (await cloudflareApi.getLastFolderAlteration(x)).data.lastUpdate,
              render: 'cdf'
            };
          })
        ));
      }
      catch (e) { }
    }

    return result;
  } catch (error) {
    console.error('Erro na API interna:', (error as Error).message);
    res.status(500).json({ error: 'Erro ao buscar dados da API externa' });
  }
}
