import { MediaContextType } from "@/types/contexts";
import { Imedia, TempMedia, Thumbnail } from "@/types/project";
import { createContext, ReactNode, useContext, useRef, useState } from "react";

const MediaContext = createContext<MediaContextType | undefined>(undefined);

interface MediaProviderProps {
    children: ReactNode;
    initialMedia?: Imedia[];
    initialThumbnail?: Thumbnail | null;
}

export const MediaProvider: React.FC<MediaProviderProps> = ({ children, initialMedia = [], initialThumbnail = null }) => {
    const [existingMedia, setExistingMedia] = useState<Imedia[]>(initialMedia);
    const [newMedia, setNewMedia] = useState<TempMedia[]>([]);
    const [thumbnail, setThumbnail] = useState<Thumbnail | null>(initialThumbnail);
    const mediaContainerRef = useRef<HTMLDivElement>(null);

    const addNewMedia = (media: TempMedia[]) => {
        setNewMedia((prev) => [...prev, ...media]);
        setTimeout(() => {
            mediaContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
        }, 0);
    };

    const removeMedia = (url: string) => {
        setExistingMedia((prev) => prev.filter((item) => item.url !== url));
        setNewMedia((prev) => prev.filter((item) => item.url !== url));
    };

    const resetNewMedia = () => {
        setNewMedia([]);
    };

    return (
        <MediaContext.Provider
            value={{
                existingMedia,
                newMedia,
                thumbnail,
                setExistingMedia,
                setNewMedia,
                setThumbnail,
                removeMedia,
                addNewMedia,
                resetNewMedia,
                mediaContainerRef,
            }}
        >
            {children}
        </MediaContext.Provider>
    );
};

export const useMedia = (): MediaContextType => {
    const context = useContext(MediaContext);
    if (!context) {
        throw new Error("useMedia must be used within a MediaProvider");
    }
    return context;
};
