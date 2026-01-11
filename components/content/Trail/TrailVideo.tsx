interface TrailVideoProps {
    src: string;
    title: string;
}

function getYouTubeEmbedUrl(url: string): string {
  // Convert various YouTube URL formats to embed format
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/;
  const match = url.match(youtubeRegex);
  
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  
  // If already an embed URL or not a YouTube URL, return as is
  return url;
}

export default function TrailVideo({ src, title }: TrailVideoProps) {
  const embedUrl = getYouTubeEmbedUrl(src);
  
  return (
    <iframe
      src={embedUrl}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="w-screen h-80 md:h-[84vh]"
    ></iframe>
  );
}