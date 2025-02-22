"use client";
import { toast } from "@/hooks/use-toast";
import { Itool } from "@/types/others";
import { ICopyright, Imedia, IStats, License, ProjectStatus, ProjectType, ProjectUploadType, TempMedia, Thumbnail } from "@/types/project";
import { MiniUser } from "@/types/user";
import React, { createContext, useState, useContext, ReactNode, useRef } from "react";
import { useUser } from "./UserContext";
import { ProjectEditorContextType, ProjectMetadata, UIState } from "@/types/contexts";
import { useProjectUploadHandler } from "@/features/project/usePrepareProjectUpload";


const UploadContext = createContext<ProjectEditorContextType | undefined>(undefined);

interface UploadProviderProps {
    children: ReactNode;
    initialData?: Partial<ProjectType>;
}

export const EditorProvider: React.FC<UploadProviderProps> = ({ children, initialData }) => {
    const { handleProjectUpload } = useProjectUploadHandler(initialData);
    const { user } = useUser();
    const [media, setMedia] = useState<(Imedia | TempMedia)[]>(initialData?.media || []);
    const mediaContainerRef = useRef<HTMLDivElement>(null);
    const [editorStage, setEditorStage] = useState<0 | 1 | 2>(0);
    const [tags, setTags] = useState<string[]>(initialData?.tags || []);
    const [tools, setTools] = useState<Itool[]>(initialData?.tools || []);
    const [collaborators, setCollaborators] = useState<MiniUser[]>(initialData?.collaborators || []);
    const [copyRight, setCopyRight] = useState<ICopyright>(initialData?.copyright || {
        allowsDownload: false,
        commercialUse: false,
        license: License.All_Rights_Reserved,
    });


    const [projectMetadata, setProjectMetadata] = useState<ProjectMetadata>({
        title: initialData?.title || "",
        description: initialData?.description || "",
        shortDescription: initialData?.shortDescription || "",
        category: initialData?.category || "",
        status: initialData?.status || ProjectStatus.DRAFT,
        thumbnail: {
            url: initialData?.thumbnail ? initialData.thumbnail : "",
            file: undefined,
            type: "image/thumbnail",
        },
        featured: initialData?.featured || false,
        projectUrl: initialData?.projectUrl || "",
        stats: initialData?.stats || { views: 0, likes: 0, comments: 0 },
    });

    const [uiState, setUIState] = useState<UIState>({
        isImageLoading: false,
        isDescOpen: !!(initialData?.description || initialData?.shortDescription),
        isUploading: false,
        showProjectDesc: false,
    });

    const updateMedia = (newMedia: TempMedia[]) => {
        const combinedMedia = [...media, ...newMedia];
        const imageFiles = combinedMedia.filter((file) => file.type.includes("image"));
        const videoFiles = combinedMedia.filter((file) => file.type.includes("video"));
        const validateMedia = (type: "image" | "video", max: number, errorMsg: string) => {
            const currentCount = type === "image" ? imageFiles.length : videoFiles.length;
            if (currentCount > max) {

                toast({ variant: "destructive", title: "Error", description: errorMsg, duration: 4000 });
                return false;
            }
            return true;
        };

        if (
            !validateMedia("video", 1, "You can only upload 1 video.") ||
            !validateMedia("image", 10, "You can only upload a maximum of 10 images.")
        ) {
            return;
        }
        setMedia(combinedMedia);
        setTimeout(() => {
            mediaContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
        }, 0);
    };


    const updateEditorStage = (stage: 0 | 1 | 2) => {
        setEditorStage(stage);
    };

    const getUploadableProject = (status: ProjectStatus) => {
        const projectData: ProjectUploadType = {
            ...(initialData?._id && { _id: initialData._id }),
            title: projectMetadata.title,
            description: projectMetadata.description,
            shortDescription: projectMetadata.shortDescription,
            thumbnail: projectMetadata.thumbnail as Thumbnail,
            media: media.map((item) => {
                const { file, ...rest } = item as TempMedia;
                return rest as Imedia;
            }),
            creator: user._id,
            collaborators: collaborators.map((collab) => collab._id),
            tags,
            tools: tools.map((tool) => tool._id) as any,
            category: projectMetadata.category,
            stats: projectMetadata.stats,
            featured: projectMetadata.featured || false,
            status: status ? status : projectMetadata.status,
            projectUrl: projectMetadata.projectUrl || "",
            copyright: copyRight,
            publishedAt: Date.now(),
        };

        const isWebStorageUrl = (url: string) => {
            return url.startsWith('blob:') || url.startsWith('data:');
        };

        const cloudUploadData = {
            uploadMedia: media.filter((item: TempMedia) => item.url.startsWith('blob:') && item?.file),
            uploadThumbnail: projectMetadata.thumbnail?.url.startsWith('blob:')
                ? projectMetadata.thumbnail
                : undefined
        };

        return { projectData, cloudUploadData };

    };

    const removeMedia = (mediaItem: Imedia) => {
        setMedia((prevMedia) => prevMedia.filter((item) => item.url !== mediaItem.url));
    };

    const updateProjectMetadata = (data: Partial<ProjectMetadata>) => {
        setProjectMetadata((prev) => ({ ...prev, ...data }));
    };

    const updateCopyRight = (newCopyRight: Partial<ICopyright>) => {
        setCopyRight((prev) => ({ ...prev, ...newCopyRight }));
    };

    const updateUIState = (updates: Partial<UIState>) => {
        setUIState((prev) => ({ ...prev, ...updates }));
    };

    const updateTools = (newTools: Itool[]) => {
        setTools(newTools);
    };
    const updateTags = (newTags: string[]) => {
        setTags(newTags);
    }

    const updateCollaborators = (newCollaborators: MiniUser[]) => {
        setCollaborators(newCollaborators);
    };




    const uploadProject = async (status: ProjectStatus) => {
        const { projectData, cloudUploadData } = getUploadableProject(status);
        await handleProjectUpload(projectData, cloudUploadData, setMedia, updateProjectMetadata, updateUIState);
    };

    return (
        <UploadContext.Provider
            value={{
                collaborators,
                updateCollaborators,
                tags, updateTags,
                mediaContainerRef,
                editorStage,
                updateEditorStage,
                copyRight,
                tools,
                media,
                projectMetadata,
                uiState,
                updateTools,
                updateCopyRight,
                updateUIState,
                removeMedia,
                updateMedia,
                updateProjectMetadata,
                uploadProject
            }}
        >
            {children}
        </UploadContext.Provider>
    );
};

export const useEditor = (): ProjectEditorContextType => {
    const context = useContext(UploadContext);
    if (!context) {
        throw new Error("useEditor must be used within an EditorProvider");
    }
    return context;
};

