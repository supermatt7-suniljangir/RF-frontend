"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Wallpaper } from "lucide-react";
import React from "react";

function ExternalProfileBanner({ cover }: { cover?: string }) {
  return (
    <Card className="w-full bg-muted mx-auto rounded-none">
      <CardContent className="w-full p-0 relative">
        <div className="flex items-center w-full p-0 justify-center h-[60vh] md:h-96 cursor-pointer relative">
          {cover ? (
            <Image
              src={cover}
              alt="Banner"
              fill
              className="w-full h-full object-cover relative"
            />
          ) : (
            <div className="grid place-items-center text-center w-full h-full bg-gray-200">
              <div className="text-center">
                <Wallpaper size={48} className="mx-auto mb-2 text-gray-500" />
                <h2 className="text-2xl font-semibold text-gray-600">No Cover Photo</h2>
                <p className="text-muted-foreground text-lg mt-2">
                  Cover photo not available
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
export default React.memo(ExternalProfileBanner);