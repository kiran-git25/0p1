export function getFileTypeFromUrl(url) {
  const ytRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/;
  const vimeoRegex = /vimeo\.com\/(\d+)/;
  const instagramRegex = /instagram\.com\/p\/([^/?]+)/;

  if (ytRegex.test(url)) return "youtube";
  if (vimeoRegex.test(url)) return "vimeo";
  if (instagramRegex.test(url)) return "instagram";
  if (/\.(mp4|webm|ogg)$/i.test(url)) return "video";
  if (/\.(mp3|wav)$/i.test(url)) return "audio";

  return "website"; // fallback
}

export function getEmbedUrl(url) {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  const instaMatch = url.match(/instagram\.com\/p\/([^/?]+)/);
  if (instaMatch) return `https://www.instagram.com/p/${instaMatch[1]}/embed`;

  return url;
}
