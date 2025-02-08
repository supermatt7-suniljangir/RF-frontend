"use client";
import { toast } from "@/hooks/use-toast";
import { Itool, ProjectOperationResponse } from "@/types/others";
import { ICopyright, Imedia, IStats, License, ProjectStatus, ProjectType, ProjectUploadType, TempMedia, Thumbnail } from "@/types/project";
import { MiniUser } from "@/types/user";
import React, { createContext, useState, useContext, ReactNode, useRef, useEffect } from "react";
import { useUser } from "./UserContext";
import { useCloudUploader } from "@/features/upload/useFileUploader";
import { ProjectEditorContextType, ProjectMetadata, UIState } from "@/types/contexts";
import { useProjectUpload } from "@/features/project/useProjectUpload";
import { useRouter } from "next/navigation";


const UploadContext = createContext<ProjectEditorContextType | undefined>(undefined);

interface UploadProviderProps {
    children: ReactNode;
    initialData?: Partial<ProjectType>;
}

export const EditorProvider: React.FC<UploadProviderProps> = ({ children, initialData }) => {
    const router = useRouter();
    const { createNew, publishing, updateExisting } = useProjectUpload();
    const { user } = useUser();
    const [media, setMedia] = useState<(Imedia | TempMedia)[]>(initialData?.media || []);
    const { handleProjectImagesUpload } = useCloudUploader()
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
            url: initialData?.thumbnail ? initialData.thumbnail : media.find((item) => item.type === "image")?.url || "",
            file: undefined,
            type: "image",
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
            thumbnail: projectMetadata.thumbnail.url,
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

        const cloudUploadData: {
            uploadMedia: TempMedia[];
            uploadThumbnail: Thumbnail;
        } = {
            uploadMedia: media
                .filter((item: TempMedia) => isWebStorageUrl(item.url) && item?.file),
            uploadThumbnail: projectMetadata?.thumbnail || undefined,
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
        try {
            updateUIState({ isUploading: true });
            const { projectData, cloudUploadData } = getUploadableProject(status);
            let updatedMedia = projectData.media.filter((item) => !item.url.startsWith("blob:")); // Remove blobs
            const isEditing = !!initialData?._id;
            if (!projectData.category || !projectData.title || projectData.media.length < 1) {
                toast({ variant: "destructive", title: "Error", description: "Incomplete project information", duration: 4000 });
                return;
            }

            const imagesToUpload = cloudUploadData.uploadMedia.filter(item => item.type.includes("image"));
            const uploadThumbnail = cloudUploadData.uploadThumbnail;
            if (uploadThumbnail.file) imagesToUpload.push(uploadThumbnail as any);

            if (imagesToUpload.length > 0) {
                const uploadedMedia = await handleProjectImagesUpload(imagesToUpload);

                if (!uploadedMedia || uploadedMedia.length === 0) {
                    toast({ variant: "destructive", title: "Error", description: "Failed to upload project images.", duration: 4000 });
                    return;
                }

                console.log("uploadedMedia", uploadedMedia);
                updatedMedia = [...updatedMedia, ...uploadedMedia] as any; // Merging only valid media URLs
            }

            projectData.media = updatedMedia;
            projectData.thumbnail = updatedMedia.find((item) => item.type === "image")?.url || updatedMedia[0].url;

            if (!projectData.thumbnail) {
                toast({ variant: "destructive", title: "Error", description: "Project thumbnail is required.", duration: 4000 });
                return;
            }

            let res: ProjectOperationResponse;
            if (isEditing) {
                res = await updateExisting(projectData);
            } else {
                res = await createNew(projectData);
            }

            console.log(res);
            if (!res) return;

            router.push(`/project/${res.data._id}`);
        } catch (error) {
            console.error("Upload error:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "An error occurred while uploading the project. Please try again.",
                duration: 4000,
            });
        } finally {
            updateUIState({ isUploading: false });
        }
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

