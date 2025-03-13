import ProjectCard from "../common/ProjectCard";
import {getUserBookmarks} from "@/services/serverServices/bookmarks/getUserBookmarks";
import {ApiResponse} from "@/types/ApiResponse";
import {MiniProject} from "@/types/project";

const Bookmarks = async () => {
    // Fetch bookmarks on the server
    const bookmarksRes: ApiResponse<MiniProject[]> = await getUserBookmarks();
    if (!bookmarksRes.success || !bookmarksRes.data) {
        return (
            <div className="text-center w-full my-8 text-lg font-medium text-destructive">
                {bookmarksRes.message || "Failed to fetch bookmarks."}
            </div>
        );
    }
    const projects = bookmarksRes.data;

    return (
        <div className="flex flex-wrap gap-4 justify-center w-full">
            {projects.length > 0 ? (
                projects.map((project) => (
                    <ProjectCard key={project._id} project={project}/>
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
