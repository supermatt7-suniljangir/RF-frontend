import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo, useCallback } from "react";
import { Imedia, TempMedia, Thumbnail } from "@/types/project";
import { useProjectContext } from "./ProjectContext";

/**
 * Interface for managing media and thumbnail uploads.
 */
interface MediaUploadContextType {
  // Already uploaded media from API.
  initialMedia: Imedia[];
  // New media uploads with associated File.
  newMedia: TempMedia[];
  addNewMedia: (media: TempMedia[]) => void;
  removeMedia: (mediaItem: TempMedia) => void;
  clearNewMedia: () => void;
  updateNewMedia: (media: TempMedia[]) => void;
  // Already existing thumbnail URL from API.
  initialThumbnail: string;
  // New thumbnail upload with file data.
  newThumbnail: Thumbnail | null;
  updateNewThumbnail: (thumbnail: Thumbnail) => void;
  clearNewThumbnail: () => void;
}

interface MediaUploadProviderProps {
  children: ReactNode;
  initialMediaData?: Imedia[];
  initialThumbnailData?: string;
}

const MediaUploadContext = createContext<MediaUploadContextType | undefined>(undefined);

export const MediaUploadProvider: React.FC<MediaUploadProviderProps> = ({
  children,
  initialMediaData = [],
  initialThumbnailData = ""
}) => {
  const { updateEditorStage, updateUIState, editorStage, uiState } = useProjectContext();
  
  // State for initial media and new media uploads.
  const [initialMedia, setInitialMedia] = useState<Imedia[]>(initialMediaData);
  const [newMedia, setNewMedia] = useState<TempMedia[]>([]);

  // State for initial thumbnail and new thumbnail.
  const [initialThumbnail] = useState<string>(initialThumbnailData);
  const [newThumbnail, setNewThumbnail] = useState<Thumbnail | null>(null);

  // Memoize functions to prevent unnecessary re-renders
  const addNewMedia = useCallback((media: TempMedia[]) => {
    setNewMedia((prev) => [...prev, ...media]);
  }, []);

  const removeMedia = useCallback((mediaItem: TempMedia) => {
    setNewMedia((prev) => prev.filter((item) => item.url !== mediaItem.url));
    setInitialMedia((prev) => prev.filter((item) => item.url !== mediaItem.url));
  }, []);

  const clearNewMedia = useCallback(() => {
    setNewMedia([]);
  }, []);

  const updateNewMedia = useCallback((media: TempMedia[]) => {
    setNewMedia(media);
  }, []);

  const updateNewThumbnail = useCallback((thumbnail: Thumbnail) => {
    setNewThumbnail(thumbnail);
  }, []);

  const clearNewThumbnail = useCallback(() => {
    setNewThumbnail(null);
  }, []);

  // Memoize the hasImage calculation
  const hasImage = useMemo(() => {
    const allMedia = [...initialMedia, ...newMedia];
    return allMedia.length > 0 && allMedia.some(item => item.type === "image");
  }, [initialMedia, newMedia]);

  useEffect(() => {
    if (hasImage && editorStage !== 1) {
      updateEditorStage(1);
    } else if (!hasImage && editorStage !== 0) {
      updateEditorStage(0);
    }

    if (hasImage !== uiState.isDescOpen) {
      updateUIState({ isDescOpen: hasImage });
    }
  }, [hasImage, uiState.isDescOpen, updateUIState]);

  // Memoize the context value
  const contextValue = useMemo(() => ({
    initialMedia,
    newMedia,
    addNewMedia,
    removeMedia,
    clearNewMedia,
    updateNewMedia,
    initialThumbnail,
    newThumbnail,
    updateNewThumbnail,
    clearNewThumbnail,
  }), [
    initialMedia,
    newMedia,
    addNewMedia,
    removeMedia,
    clearNewMedia,
    updateNewMedia,
    initialThumbnail,
    newThumbnail,
    updateNewThumbnail,
    clearNewThumbnail
  ]);

  return (
    <MediaUploadContext.Provider value={contextValue}>
      {children}
    </MediaUploadContext.Provider>
  );
};

export const useMediaUpload = (): MediaUploadContextType => {
  const context = useContext(MediaUploadContext);
  if (!context) {
    throw new Error("useMediaUpload must be used within a MediaUploadProvider");
  }
  return context;
};