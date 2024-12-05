import ProjectCard from "@/components/common/ProjectCard";
import { ProjectMini } from "@/types/project";
// import { ProjectMini } from "@/types/project";

const projects: ProjectMini[] = [
  {
    _id: "1",
    title: "Modern UI Design",
    thumbnail: "https://example.com/thumbnail1.jpg",
    stats: {
      views: 1500,
      likes: 320,
      comments: 45,
    },
    featured: true,
    publishedAt: new Date("2024-01-15"),
    status: "published",
  },
  {
    _id: "2",
    title: "E-Commerce Dashboard",
    thumbnail: "https://example.com/thumbnail2.jpg",
    stats: {
      views: 800,
      likes: 120,
      comments: 20,
    },
    featured: false,
    publishedAt: new Date("2023-12-01"),
    status: "draft",
  },
  {
    _id: "3",
    title: "Travel Blog Landing Page",
    thumbnail: "https://example.com/thumbnail3.jpg",
    stats: {
      views: 2500,
      likes: 450,
      comments: 90,
    },
    featured: true,
    publishedAt: new Date("2024-02-20"),
    status: "published",
  },
  {
    _id: "4",
    title: "Fitness App Interface",
    thumbnail: "https://example.com/thumbnail4.jpg",
    stats: {
      views: 1200,
      likes: 210,
      comments: 30,
    },
    featured: false,
    publishedAt: new Date("2024-01-10"),
    status: "draft",
  },
  {
    _id: "5",
    title: "Portfolio Showcase",
    thumbnail: "https://example.com/thumbnail5.jpg",
    stats: {
      views: 3000,
      likes: 520,
      comments: 150,
    },
    featured: true,
    publishedAt: new Date("2024-03-01"),
    status: "published",
  },
];

const HomePage: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
      {projects.map((project, index) => (
        <ProjectCard key={index} project={project} />
      ))}
    </div>
  );
};

export default HomePage;
