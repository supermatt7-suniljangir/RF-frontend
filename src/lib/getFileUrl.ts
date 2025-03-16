export const getFileUrl = (key: string): string => {
  const imageUrl = `https://${process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN}/${key}`;
  return imageUrl;
};
