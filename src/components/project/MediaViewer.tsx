import Image from "next/image";
import projectImage from "../../media/project-1.webp";
interface Media {
  type: "image" | "video";
  url: string;
}
interface MediaViewerProps {
  media: Media[];
}

const ImageViewer: React.FC<MediaViewerProps> = ({ media }) => {
  return (
    <div className="w-full mx-auto">
      {media.map((item, index) => (
        <div key={index} className="aspect-video w-full p-2 md:p-0 relative">
          {item.type === "image" ? (
            <Image
              fill
              src={projectImage}
              alt={`Media ${index + 1}`}
              className="object-cover rounded"
            />
          ) : (
            <video
              src={item.url}
              controls
              className="w-full h-full rounded object-cover"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ImageViewer;
