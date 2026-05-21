"use client";

import Image from "next/image";
import { useEffect } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";

interface LightboxProps {
  image: string;
  onClose: () => void;
}

export default function Lightbox({ image, onClose }: LightboxProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogPortal>
        <DialogOverlay className="bg-black/60 backdrop-blur-sm" />

        <DialogContent className="border-none bg-transparent shadow-none p-0 max-w-none flex items-center justify-center">
          {/* Custom close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md transition-all duration-200 hover:scale-110"
          >
            <Cross2Icon strokeWidth={2.5} />
          </button>

          <Image
            src={image}
            alt="Preview"
            width={0}
            height={0}
            sizes="100vw"
            priority
            unoptimized
            className="w-auto h-auto max-w-[95vw] max-h-[95vh] object-contain select-none"
          />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

