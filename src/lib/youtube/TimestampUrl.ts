export default function createYouTubeTimestampUrl(
  videoUrl: string,
  seconds: number,
) {
  if (!videoUrl) return "";
  const separator = videoUrl.includes("?") ? "&" : "?";

  return `${videoUrl}${separator}t=${Math.floor(seconds)}s`;
}
