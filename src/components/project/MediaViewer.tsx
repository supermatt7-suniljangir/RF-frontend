import Image from "next/image";
import VideoPlayer from "./VideoPlayer"; // Import the client-side component
import projectImage from "../../media/project-1.webp";

interface Media {
  type: "image" | "video";
  url: string;
}

interface MediaViewerProps {
  media: Media[];
}

const MediaViewer: React.FC<MediaViewerProps> = ({ media }) => {
  if (media.length === 0) return null;

  return (
    <div className="w-full mx-auto">
      {media.map((item, index) => (
        <div key={index} className="p-2 md:p-0">
          {item.type === "image" ? (
            <div className="relative">
              <Image
              sizes="(max-width: 640px) 100vw, 640px"
                src={item.url}
                alt={`Media ${index + 1}`}
                className="rounded h-auto w-full"
                width={0} // Let Next.js calculate dimensions dynamically
                height={0} // Let Next.js calculate dimensions dynamically                              
              />
            </div>
          ) : (
            <VideoPlayer
              url={"/media/video.mp4"}
              key={index}
              playing={false}
              muted={true}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default MediaViewer;
