import ProjectCard from "@/components/common/ProjectCard";

interface Project {
  title: string;
  imageUrl: string;
  views: number;
  likes: number;
}

const projects: Project[] = [
  {
    title: "Funky Pumpkin Challenge 2024",
    imageUrl: "/funky-pumpkin.jpg",
    views: 11000,
    likes: 140,
  },
  {
    title: "Sumida Hokusai Museum",
    imageUrl: "/sumida-museum.jpg",
    views: 1600,
    likes: 175,
  },
  {
    title: "Sumida Hokusai Museum",
    imageUrl: "/sumida-museum.jpg",
    views: 1600,
    likes: 175,
  },
  {
    title: "Sumida Hokusai Museum",
    imageUrl: "/sumida-museum.jpg",
    views: 1600,
    likes: 175,
  },
  {
    title: "Sumida Hokusai Museum",
    imageUrl: "/sumida-museum.jpg",
    views: 1600,
    likes: 175,
  },
  // Add more projects as needed
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
