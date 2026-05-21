"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "./Lightbox";

interface Props {
  src: string;
  alt: string;
}

export default function MediaImage({ src, alt }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="relative cursor-zoom-in" onClick={() => setOpen(true)}>
        <Image
          priority
          sizes="(max-width: 640px) 100vw, 640px"
          src={src}
          alt={alt}
          className="rounded h-auto w-full"
          width={0}
          height={0}
          unoptimized
        />
      </div>

      {open && <Lightbox image={src} onClose={() => setOpen(false)} />}
    </>
  );
}
