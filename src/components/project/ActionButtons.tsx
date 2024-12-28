// components/ProjectHeader/ActionButtons.tsx
"use client";
import { MessageCircle, Share2, Info, MoreVertical } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ShareModal from "./ShareModal";
import { useState } from "react";
import { ProjectType } from "@/types/project";

export default function ActionButtons({ project }: { project: ProjectType }) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  if (isDesktop) {
    return (
      <>
        <div className="fixed right-4 top-1/3 mt-8 flex flex-col gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setIsShareModalOpen(true)}>
            <Share2 className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Info className="h-5 w-5" />
          </Button>
        </div>
        <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} project={project} />
      </>
    );
  }

  return (
    <>
      <DropdownMenu >
        <DropdownMenuTrigger asChild className="mb-3 p-0 mr-4 cursor-pointer w-8" >
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="gap-2">
            <MessageCircle className="h-4 w-4" />
            <span>Comment</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2" onClick={()=>setIsShareModalOpen(true)}>
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2">
            <Info className="h-4 w-4" />
            <span>Info</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} project={project} />
    </>
  );
}