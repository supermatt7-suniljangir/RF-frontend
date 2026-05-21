import MediaImage from "./MediaImage";
import VideoPlayer from "./VideoPlayer";

interface Media {
  type: "image" | "video";
  url: string;
}

interface MediaViewerProps {
  media: Media[];
}

const MediaViewer = ({ media }: MediaViewerProps) => {
  if (media.length === 0) return null;

  return (
    <div className="w-full mx-auto">
      {media.map((item, index) => (
        <div key={index} className="p-0">
          {item.type === "image" ? (
            <MediaImage src={item.url} alt={`Media ${index + 1}`} />
          ) : (
            <VideoPlayer url={item.url} playing={false} muted={true} />
          )}
        </div>
      ))}
    </div>
  );
};

export default MediaViewer;
