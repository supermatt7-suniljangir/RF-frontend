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

  // Handle file uploads with validation for image types
  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const invalidFiles = files.filter(
      (file) => !file.type.startsWith("image/"),
    );
    if (invalidFiles.length > 0) {
      toast({
        variant: "destructive",
        title: "Error processing files",
        description: "Only images are allowed.",
        duration: 4000,
      });
      event.target.value = "";
      return;
    }

    // Separate files into video and image groups
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    // Map files into media objects with blob URLs
    const mediaFiles = imageFiles.map((file, i) => ({
      type: "image",
      file,
      id: i + 1,
      url: URL.createObjectURL(file),
    }));

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
        description: "Please upload at least one image.",
        duration: 4000,
      });
      return;
    }
    updateEditorStage(2);
  };

  return (
    <Card className="h-full w-full rounded-none border-none">
      <CardContent className="flex h-full w-full flex-col items-center space-y-4 p-0 pt-10">
        {/* File Upload Section */}
        <Card className="h-auto w-5/6 rounded-none py-4">
          <Label
            htmlFor="file-upload"
            className="h-full w-full cursor-pointer p-0"
          >
            <Input
              id="file-upload"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/jpg,image/gif"
              className="hidden"
              onChange={handleMediaUpload}
            />
            <CardContent className="flex items-center justify-center space-x-2 p-0">
              <Image className="!h-5 !w-5" />
              <p className="text-sm text-muted-foreground">Image / video</p>
            </CardContent>
          </Label>
        </Card>

        <Stagebar />

        {/* Project Details Section */}
        <Card className="h-auto w-5/6 rounded-none py-4">
          <CardContent className="flex items-center justify-center space-x-2 p-0">
            <Text className="!h-5 !w-5" />
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
