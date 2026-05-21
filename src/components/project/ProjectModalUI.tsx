"use client";

import { useRouter } from "next/navigation";
import { Cross2Icon } from "@radix-ui/react-icons";
import { createPortal } from "react-dom";
import { useCallback, useEffect } from "react";

import { ProjectType } from "@/types/project";
import ProjectInfo from "@/components/project/Project";

export default function ProjectModalUI({ project }: { project: ProjectType }) {
  const router = useRouter();

  const onClose = useCallback(() => {
    router.back();
  }, [router]);

  // close the window on esc key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);
  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/90 py-8 md:px-16 xl:px-32"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="fixed right-4 top-4 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-white/20"
      >
        <Cross2Icon />
      </button>

      <div onClick={(e) => e.stopPropagation()}>
        <ProjectInfo project={project} isModal={true} />
      </div>
    </div>,
    document.body,
  );
}
