import { image } from 'types';

const cache = new Map<image, string>();

export default async function getBase64ImageUrl(image: image): Promise<string> {
  let url = cache.get(image);
  if (url) {
    return url;
  }

  // Pede a imagem já pequena e comprimida direto da Cloudinary
  const response = await fetch(
    `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_jpg,w_8,q_70/${image.public_id}.${image.format}`
  );

  const buffer = await response.arrayBuffer();

  // Só transforma pra base64, sem usar sharp
  url = `data:image/jpeg;base64,${Buffer.from(buffer).toString('base64')}`;
  cache.set(image, url);

  return url;
}
