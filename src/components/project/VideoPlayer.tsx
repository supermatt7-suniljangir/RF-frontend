// VideoPlayer.tsx
"use client";

import { memo, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

interface VideoPlayerProps {
    url: string;
    playing?: boolean;
    controls?: boolean;
    loop?: boolean;
    muted?: boolean;
    styles?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
    url,
    playing = false,
    controls = true,
    loop = false,
    muted = false,
    styles
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const plyrRef = useRef<Plyr>();
    const [isClient, setIsClient] = useState(false);

    // Handle client-side mounting
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Initialize Plyr
    useEffect(() => {
        if (!isClient || !videoRef.current) return;

        // Destroy existing instance if it exists
        if (plyrRef.current) {
            plyrRef.current.destroy();
        }

        // Create new Plyr instance
        plyrRef.current = new Plyr(videoRef.current, {
            controls: controls ? ['play-large', 'progress', 'fullscreen'] : [],
            hideControls: false,
            clickToPlay: true,
            autoplay: playing,
            loop: { active: loop },
            muted: muted || true,
            resetOnEnd: true,
        });

        // Ensure proper initialization
        const initializeVideo = () => {
            if (plyrRef.current) {
                plyrRef.current.poster = ''; // Clear poster to ensure video displays
                if (playing) {
                    plyrRef.current.play();
                }
            }
        };

        // Initialize after a short delay to ensure DOM is ready
        setTimeout(initializeVideo, 100);

        return () => {
            if (plyrRef.current) {
                plyrRef.current.destroy();
            }
        };
    }, [isClient, url]); // Re-initialize when URL changes

    // Handle prop changes
    useEffect(() => {
        if (plyrRef.current && isClient) {
            if (playing) {
                plyrRef.current.play();
            } else {
                plyrRef.current.pause();
            }
        }
    }, [playing, isClient]);

    if (!isClient) {
        return <div className="aspect-video w-full rounded" />;
    }

    return (
        <div className={cn("aspect-video w-full", styles)}>
            <video
                ref={videoRef}
                className="rounded plyr-react"
                preload="metadata"
            >
                <source src={url} type="video/mp4" />
            </video>
        </div>
    );
};

export default memo(VideoPlayer);