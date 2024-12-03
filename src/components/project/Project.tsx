import ActionButtons from "./ActionButtons";
import ProjectHeader from "./ProjectHeader";
import MediaViewer from "./MediaViewer";
import { ProjectType } from "@/types/project";

const project: ProjectType = {
  title: "Project C",
  description: "An interactive app design for a food delivery service.",
  shortDescription: "Short description of Project C.",
  thumbnail: "https://example.com/thumbnail3.jpg",
  media: [
    { type: "image", url: "https://example.com/image4.jpg" },
    { type: "video", url: "https://example.com/video2.mp4" },
  ],
  creator: "507f1f77bcf86cd799439014", // Sample ObjectId
  collaborators: ["507f1f77bcf86cd799439015"],
  tags: ["app design", "mobile", "food delivery"],
  tools: [{ name: "Sketch", icon: "https://example.com/sketch-icon.png" }],
  categories: ["App Design", "Mobile"],
  stats: {
    views: 150,
    likes: 72,
    saves: 18,
    comments: 2,
  },
  comments: [
    {
      user: "507f1f77bcf86cd799439014", // Sample ObjectId
      content: "This would be great for a food delivery app!",
      createdAt: new Date(),
    },
  ],
  featured: false,
  publishedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  status: "draft",
  projectUrl: "https://example.com/project-c",
  copyright: {
    license: "CC0",
    allowsDownload: true,
    commercialUse: true,
  },
};
const ProjectInfo = ({ id }: { id: string }) => {
  const { media } = project;
  console.log(id);
  return (
    <main className="w-full sm:p-4 md:p-6 ">
      <div className="flex items-end mb-4 w-full justify-center">
        <ProjectHeader project={project} />
        <ActionButtons />
      </div>
      <MediaViewer media={media} />
    </main>
  );
};

export default ProjectInfo;
