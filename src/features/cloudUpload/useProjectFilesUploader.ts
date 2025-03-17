"use client";

import {useState} from "react";
import imageCompression from "browser-image-compression";
import {getFileUrl} from "@/lib/getFileUrl";
import {TempMedia, Thumbnail} from "@/types/project";
import {Config} from "@/config/config";
import FilesUploadService from "@/services/clientServices/filesUpload/FilesUploadService";
import {UploadFileResponse} from "@/types/upload";

const validateFiles = (files: TempMedia[]) => {
    const {MAX_IMAGE_SIZE, MAX_FILES, MAX_VIDEO_SIZE} = Config.FILE_LIMITS;

    //  check if any file is anything other than image or video
    if (
        files.filter((f) => !f.type.includes("image") && !f.type.includes("video"))
            .length > 0
    ) {
        throw new Error("Only images and videos are allowed.");
    }

    if (files.length > MAX_FILES) {
        throw new Error(`Upload between 1 and ${MAX_FILES} files.`);
    }

    if (files.filter((f) => f.type.includes("video")).length > 1) {
        throw new Error("Only 1 video can be uploaded.");
    }

    for (const file of files) {
        if (
            (file.type.includes("image") && file.file.size > MAX_IMAGE_SIZE) ||
            (file.type.includes("video") && file.file.size > MAX_VIDEO_SIZE)
        ) {
            throw new Error("Images must be < 5MB, Videos < 50MB.");
        }
    }
};

const compressImages = async (files: TempMedia[]): Promise<TempMedia[]> => {
    const compressedFiles: TempMedia[] = [];
    const options = Config.COMPRESSION_OPTIONS;

    for (const file of files) {
        if (!file.type.includes("image")) {
            compressedFiles.push(file);
            continue;
        }

        try {
            const sizeMB = file.file.size / (1024 * 1024);

            if (sizeMB < 1) {
                console.log('Skipping compression for small file');
                compressedFiles.push(file);
                continue;
            }

            const compressionOptions = {...options.default};
            if (sizeMB < 2) {
                compressionOptions.maxSizeMB = 1.6;
            } else if (sizeMB < 4) {
                compressionOptions.maxSizeMB = 3.2;
            } else {
                compressionOptions.maxSizeMB = 4;
            }

            const compressedFile = await imageCompression(file.file, compressionOptions);
            compressedFiles.push({...file, file: compressedFile});
        } catch (error) {
            console.error(`Image compression failed: ${file.file.name}`, error);
            compressedFiles.push(file);
        }
    }

    return compressedFiles;
};


const uploadProjectFiles = async (
    files: TempMedia[],
    thumbnail?: Thumbnail,
) => {
    try {
        if (files.length === 0 && !thumbnail) {
            throw new Error("No files to upload");
        }
        const processedFiles = files.length > 0 ? await compressImages(files) : [];

        // call it only if files.length > 0
        if (files.length > 0) {
            validateFiles(processedFiles);
        }
        const uploadUrls: UploadFileResponse[] =
            processedFiles.length > 0
                ? await FilesUploadService.getUploadUrls(
                    processedFiles.map((item) => item.file),
                )
                : [];
        // Check if a thumbnail is provided and get a separate signed URL
        let thumbnailUrl: UploadFileResponse | null = null;
        if (thumbnail) {
            const SignedThumbnailUrl = await FilesUploadService.getUploadUrls([
                thumbnail.file,
            ]);
            thumbnailUrl = SignedThumbnailUrl[0];
        }

        const uploadData =
            uploadUrls.length > 0
                ? uploadUrls.map((url, i) => ({
                    uploadUrl: url?.uploadUrl,
                    file: processedFiles[i]?.file,
                }))
                : [];
        // Add the thumbnail to upload data if it exists
        if (thumbnail && thumbnailUrl) {
            uploadData.push({
                uploadUrl: thumbnailUrl?.uploadUrl,
                file: thumbnail?.file,
            });
        }

        // Upload all files
        await FilesUploadService.uploadFiles(uploadData);

        // Prepare the response
        const uploadedFiles = uploadUrls.map((item) => ({
            type: item.key.includes("video") ? "video" : "image",
            url: getFileUrl(item.key),
        }));

        // Add the thumbnail to the response
        if (thumbnailUrl) {
            uploadedFiles.push({
                type: "image/thumbnail",
                url: getFileUrl(thumbnailUrl.key),
            });
        }
        return uploadedFiles;
    } catch (error) {
        console.error("Project files upload failed", error);
        throw error;
    }
};

export const useProjectFilesUploader = () => {
    const [loading, setLoading] = useState(false);

    const handleProjectFilesUpload = async (
        files: TempMedia[],
        thumnail?: Thumbnail,
    ) => {
        setLoading(true);
        try {
            return await uploadProjectFiles(files, thumnail);
        } finally {
            setLoading(false);
        }
    };

    return {handleProjectFilesUpload, loading};
};
