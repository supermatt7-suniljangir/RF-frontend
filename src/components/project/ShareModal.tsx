"use client";
import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Twitter,
    Facebook,
    Linkedin,
    Link2,
    Copy,
    Check
} from "lucide-react";
import { MiniProject, ProjectType } from '@/types/project';
import { MiniUser } from '@/types/user';
import ProjectCard from '../common/ProjectCard';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    project?: MiniProject,
}

const ShareModal: React.FC<ShareModalProps> = ({
    isOpen,
    onClose,
    project,
}) => {
    if (!project) return null;
    const { _id, title, thumbnail, creator: { fullName, avatar } } = project;
    const projectUrl = `${window?.location.origin}/project/${_id}`;
    const [copied, setCopied] = React.useState(false);
    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(projectUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const shareUrls = {
        twitter: `https://twitter.com/intent/tweet?text=Check out this project: ${title}&url=${encodeURIComponent(projectUrl)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(projectUrl)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(projectUrl)}`
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md p-6">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-center">
                        Share Project
                    </DialogTitle>
                </DialogHeader>
                <ProjectCard project={project} renderUser={false} />
                <div className="mt-2 space-y-6">
                    {/* Social sharing buttons */}
                    <div className="flex justify-center gap-4">
                        <Button
                            variant="outline"
                            className="p-2"
                            onClick={() => window.open(shareUrls.twitter, '_blank')}
                        >
                            <Twitter className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="outline"
                            className="p-2"
                            onClick={() => window.open(shareUrls.facebook, '_blank')}
                        >
                            <Facebook className="w-5 h-5 " />
                        </Button>
                        <Button
                            variant="outline"
                            className="p-2"
                            onClick={() => window.open(shareUrls.linkedin, '_blank')}
                        >
                            <Linkedin className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Project link section */}
                    <div className="space-y-2">
                        <label className="text-sm text-muted-foreground flex items-center gap-2">
                            <Link2 className="w-4 h-4" />
                            Project Link
                        </label>
                        <div className="flex gap-2">
                            <Input
                                value={projectUrl}
                                readOnly
                            />
                            <Button
                                variant="outline"
                                className="flex-shrink-0"
                                onClick={handleCopyLink}
                            >
                                {copied ? (
                                    <Check className="w-4 h-4" />
                                ) : (
                                    <Copy className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="text-muted-foreground"
                    >
                        Done
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ShareModal;