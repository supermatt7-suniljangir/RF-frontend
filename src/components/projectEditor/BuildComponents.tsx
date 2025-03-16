"use client";
import React from "react";
import { Card, CardContent } from "../ui/card";
import { Image, Text } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { toast } from "@/hooks/use-toast";
import ProjectWindow from "./EditorWindow/ProjectWindow";
import Copyright from "./Copyright";
import Stagebar from "./Stagebar";
import { useProjectContext } from "@/contexts/ProjectContext";
import { useMediaUpload } from "@/contexts/MediaContext";
import { TempMedia } from "@/types/project";

const BuildComponents = () => {
  // Retrieve project-specific state/actions
  const { updateEditorStage, uiState, projectMetadata } = useProjectContext();
  // Retrieve media-related state/actions
  const { initialMedia, newMedia, addNewMedia } = useMediaUpload();

  // Combine initial and new media for rendering/validation
  const media = [...initialMedia, ...newMedia];

  // Handle file uploads with validation for image/video types
  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const invalidFiles = files.filter(
      (file) =>
        !file.type.startsWith("image/") && !file.type.startsWith("video/"),
    );
    if (invalidFiles.length > 0) {
      toast({
        variant: "destructive",
        title: "Error processing files",
        description: "Only images and videos are allowed.",
        duration: 4000,
      });
      event.target.value = "";
      return;
    }

    // Separate files into video and image groups
    const videoFiles = files.filter((file) => file.type.startsWith("video/"));
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    // Map files into media objects with blob URLs
    const mediaFiles = [
      ...videoFiles.map((file) => ({
        type: "video",
        file,
        url: URL.createObjectURL(file),
      })),
      ...imageFiles.map((file) => ({
        type: "image",
        file,
        url: URL.createObjectURL(file),
      })),
    ];

    // Update new media state
    addNewMedia(mediaFiles as TempMedia[]);
    event.target.value = "";
  };

  // Handle continue action with basic validation
  const handleContinue = () => {
    if (media.length < 1) {
      toast({
        variant: "destructive",
        title: "Error processing files",
        description: "Please upload at least one image or video.",
        duration: 4000,
      });
      return;
    }
    updateEditorStage(2);
  };

  return (
    <Card className="w-full h-full rounded-none border-none">
      <CardContent className="w-full h-full flex flex-col items-center p-0 pt-10 space-y-4">
        {/* File Upload Section */}
        <Card className="w-5/6 h-auto py-4 rounded-none">
          <Label
            htmlFor="file-upload"
            className="w-full h-full p-0 cursor-pointer"
          >
            <Input
              id="file-upload"
              type="file"
              multiple
              className="hidden"
              onChange={handleMediaUpload}
            />
            <CardContent className="p-0 flex items-center justify-center space-x-2">
              <Image className="!w-5 !h-5" />
              <p className="text-sm text-muted-foreground">Image / video</p>
            </CardContent>
          </Label>
        </Card>

        <Stagebar />

        {/* Project Details Section */}
        <Card className="w-5/6 h-auto rounded-none py-4">
          <CardContent className="p-0 flex items-center justify-center space-x-2">
            <Text className="!w-5 !h-5" />
            <p className="text-sm text-muted-foreground">Project Details</p>
          </CardContent>
        </Card>

        <Copyright />

        {/* Continue Action Button */}
        <Button
          variant="secondary"
          disabled={
            media.length < 1 || !projectMetadata.title || !uiState.isDescOpen
          }
          onClick={handleContinue}
          className="w-5/6 rounded-none"
        >
          Continue
        </Button>

        {/* Final Step Modal */}
        <ProjectWindow />
      </CardContent>
    </Card>
  );
};

export default BuildComponents;
