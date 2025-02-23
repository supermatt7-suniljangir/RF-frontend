import ProjectCard from "../common/ProjectCard";
import { getUserBookmarks } from "@/services/bookmarks/getUserBookmarks";


const Bookmarks = async () => {
    // Fetch bookmarks on the server
    const bookmarks = await getUserBookmarks();
    const projects = bookmarks.map((bookmark) => bookmark.project);

    return (
        <div className="flex flex-wrap gap-4 justify-center  w-full">
            {projects.length > 0 ? (
                projects.map((project) => (
                    <ProjectCard key={project._id} project={project} />
                ))
            ) : (
                <div className="text-center w-full my-8 text-lg font-medium">
                    No Bookmarks
                </div>
            )}
        </div>
    );
};

export default Bookmarks;
