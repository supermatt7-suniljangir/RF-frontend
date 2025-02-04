
"use client";
import { useEditor } from '@/contexts/ProjectEditorContext';
import Image from 'next/image';
import React from 'react';
import VideoPlayer from '../project/VideoPlayer';
import { Trash2 } from 'lucide-react';
import { Button } from '../ui/button';

const ProjectMedia = () => {
    const { media, removeMedia } = useEditor();
    return (
        <div className="w-full">
            {media.map((item, index) => (
                <div key={index} className="p-2 md:p-0 relative">
                    <Button onClick={() => removeMedia(item)} variant='destructive' className='absolute p-2 h-auto w-auto  top-2 right-2 z-10'> <Trash2 className="w-6 h-6" /></Button>
                    {item.type === "image" ? (
                        <div className="relative">
                            <Image
                                src={item.url}
                                alt={`Media ${index + 1}`}
                                className="rounded h-auto w-full"
                                width={0} // Let Next.js calculate dimensions dynamically
                                height={0} // Let Next.js calculate dimensions dynamically                              
                            />
                        </div>
                    ) : (
                        <VideoPlayer
                            url={"/media/video.mp4"}
                            key={index}
                            playing={false}
                            muted={true}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default ProjectMedia
