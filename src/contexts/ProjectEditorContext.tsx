"use client";

import useTools from "@/features/tools/useTools";
import { toast } from "@/hooks/use-toast";
import { Itool } from "@/types/others";
import { ICopyright, Imedia, IStats, License, ProjectType, ProjectUploadType, tempMedia, Thumbnail } from "@/types/project";
import { MiniUser } from "@/types/user";
import React, { createContext, useState, useContext, ReactNode, useRef } from "react";
import { useUser } from "./UserContext";
import Project from "@/app/(project)/project/[id]/page";



export type ProjectMetadata = {
    title: string;
    description: string;
    shortDescription: string;
    thumbnail: Thumbnail;
    category: string;
    status: "draft" | "published";
    projectUrl?: string;
    featured?: boolean;
    stats?: IStats;
};

export type UIState = {
    isImageLoading: boolean;
    isDescOpen: boolean;
    isUploading: boolean;
    showProjectDesc: boolean;
};

interface UploadableProject {
    projectData: ProjectUploadType;
    cloudUploadData: { uploadMedia: File[] | []; uploadThumbnail: File | "" };
}

interface ProjectEditorContextType {
    mediaContainerRef?: React.RefObject<HTMLDivElement>;
    media: Imedia[];
    tags: string[];
    updateTags: (tags: string[]) => void;
    projectMetadata: ProjectMetadata;
    uiState: UIState;
    tools: Itool[];
    copyRight: ICopyright;
    editorStage: 0 | 1 | 2;
    collaborators: MiniUser[];
    updateCollaborators: (collaborators: MiniUser[]) => void;
    updateEditorStage: (stage: 0 | 1 | 2) => void;
    updateTools: (tools: Itool[]) => void;
    updateCopyRight: (copyRight: Partial<ICopyright>) => void;
    updateUIState: (updates: Partial<UIState>) => void;
    removeMedia: (mediaItem: Imedia) => void;
    updateMedia: (media: Imedia[]) => void;
    updateProjectMetadata: (data: Partial<ProjectMetadata>) => void;
    uploadProject: () => Promise<void>;
    getUploadableProject: () => UploadableProject;
}

const UploadContext = createContext<ProjectEditorContextType | undefined>(undefined);

interface UploadProviderProps {
    children: ReactNode;
    initialData?: Partial<ProjectType>;
}

export const EditorProvider: React.FC<UploadProviderProps> = ({ children, initialData }) => {
    const { user } = useUser();

    const mediaContainerRef = useRef<HTMLDivElement>(null);
    const [editorStage, setEditorStage] = useState<0 | 1 | 2>(0);
    const [tags, setTags] = useState<string[]>(initialData?.tags || []);
    const [media, setMedia] = useState<Imedia[] | tempMedia[]>(initialData?.media || []);
    const [tools, setTools] = useState<Itool[]>(initialData?.tools || [{ name: "Figma", _id: "1", icon: "figma" }]);
    const [collaborators, setCollaborators] = useState<MiniUser[]>(initialData?.collaborators || []);
    const [copyRight, setCopyRight] = useState<ICopyright>(initialData?.copyright || {
        allowsDownload: false,
        commercialUse: false,
        license: License.All_Rights_Reserved,
    });

    const [projectMetadata, setProjectMetadata] = useState<ProjectMetadata>({
        title: initialData?.title || "sdjfasdkjfasjf;kasdjf;sdakjfsd",
        description: initialData?.description || "sdfjasdfhaksjdfhsjadhfkljsdhsdfsdfdsfdsdffklsd",
        shortDescription: initialData?.shortDescription || "asdfhalsdfhslkjasdhfajshsdsdsdfd",
        category: initialData?.category || "Illustration",
        status: initialData?.status || "draft",
        thumbnail: {
            url: initialData?.thumbnail || "",
            file: undefined,
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

    const updateMedia = (newMedia: Imedia[]) => {
        const combinedMedia = [...media, ...newMedia];
        const imageFiles = combinedMedia.filter((file) => file.type === "image");
        const videoFiles = combinedMedia.filter((file) => file.type === "video");
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
        setMedia(combinedMedia);
        setTimeout(() => {
            mediaContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
        }, 0);

    };

    const updateEditorStage = (stage: 0 | 1 | 2) => {
        setEditorStage(stage);
    };
    const getUploadableProject = () => {
        const projectData: ProjectUploadType = {
            ...(initialData?._id && { _id: initialData._id }),
            title: projectMetadata.title,
            description: projectMetadata.description,
            shortDescription: projectMetadata.shortDescription,
            thumbnail: projectMetadata.thumbnail.url,
            media: media.map((item) => {
                const { file, ...rest } = item as tempMedia;
                return rest as Imedia;
            }),
            creator: user._id,
            collaborators: collaborators.map((collab) => collab._id),
            tags,
            tools,
            category: projectMetadata.category,
            stats: projectMetadata.stats,
            featured: projectMetadata.featured,
            publishedAt: new Date(),
            updatedAt: new Date(),
            status: projectMetadata.status,
            projectUrl: projectMetadata.projectUrl,
            copyright: copyRight,
        };

        const cloudUploadData: {
            uploadMedia: File[] | [];
            uploadThumbnail: File | "";
        } = {
            uploadMedia: media.filter((item) => (item as tempMedia)?.file).map((item) => (item as tempMedia).file as File),
            uploadThumbnail: projectMetadata?.thumbnail?.file,
        }

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




    const uploadProject = async () => {
        try {
            updateUIState({ isUploading: true });
            // Your upload logic here
        } catch (error) {
            console.error("Upload error:", error);
        } finally {
            updateUIState({ isUploading: false });
        }
    };




    // handle cloud upload
    const handleCloudUPload = () => {
        const { projectData, cloudUploadData } = getUploadableProject();
        const { uploadMedia, uploadThumbnail } = cloudUploadData;
        const uploadPromises = uploadMedia.map((media) => uploadToCloudinary(media));
        if (uploadThumbnail) {
            uploadPromises.push(uploadToCloudinary(uploadThumbnail));
        }
        try {
            const uploadedMedia = await Promise.all(uploadPromises);
            const uploadedThumbnail = uploadedMedia.find((media) => media.type === "thumbnail");
            const uploadedImages = uploadedMedia.filter((media) => media.type === "image");
            const uploadedVideos = uploadedMedia.filter((media) => media.type === "video");
            const uploadedData = {
                ...projectData,
                thumbnail: uploadedThumbnail?.url || projectData.thumbnail,
                media: [...uploadedImages, ...uploadedVideos, ...projectData.media],
            };
            await uploadProject(uploadedData);
        } catch (error) {
            console.error("Cloud upload error:", error)
        }
    }




    return (
        <UploadContext.Provider
            value={{
                getUploadableProject,
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
                uploadProject,
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

