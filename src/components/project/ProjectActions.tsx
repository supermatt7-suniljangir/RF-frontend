"use client";
import { useState } from "react";

interface ProjectActionsProps {
  initialLiked?: boolean;
}

const ProjectActions: React.FC<ProjectActionsProps> = ({ initialLiked = false }) => {
  const [liked, setLiked] = useState(initialLiked);

  return (
    <div className="space-y-4">
      <button
        onClick={() => setLiked(!liked)}
        className={`flex items-center space-x-2 px-4 py-2 rounded ${
          liked ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
      >
        {liked ? "Liked" : "Like"}
      </button>
      <button className="px-4 py-2 rounded bg-gray-200">Save</button>
      <button className="px-4 py-2 rounded bg-gray-200">Share</button>
    </div>
  );
};

export default ProjectActions;
