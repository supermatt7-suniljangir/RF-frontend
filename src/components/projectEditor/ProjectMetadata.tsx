
"use client";
import React, { useEffect } from "react";
import { useEditor } from "@/contexts/ProjectEditorContext";
import { useForm, SubmitHandler } from "react-hook-form";
import { Trash2 } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { ProjectMetadata } from "@/types/contexts";



const ProjectDescInputs: React.FC = () => {
    const { uiState: { isDescOpen }, updateProjectMetadata, projectMetadata, updateEditorStage } = useEditor();
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<ProjectMetadata>();


    // reset form when projectMetadata changes
    useEffect(() => {
        if (projectMetadata.title) {
            reset({
                title: projectMetadata.title,
                shortDescription: projectMetadata.shortDescription,
                description: projectMetadata.description,
            });
        }
    }, [projectMetadata, reset]);


    // Update state when form is submitted
    const onSubmit: SubmitHandler<ProjectMetadata> = (data) => {
        updateProjectMetadata(data);
    };
    if (!isDescOpen) return null;

    return (
        <Card className="relative rounded-none py-10 px-4">
            <h2 className="text-center text-lg font-semibold">Project Details</h2>
            <CardContent className="mt-8 space-y-8 text-muted-foreground">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Input
                            {...register("title", {
                                required: "Title is required",
                                minLength: {
                                    value: 6,
                                    message: "Title must be at least 6 characters",
                                },
                                maxLength: {
                                    value: 40,
                                    message: "Title cannot exceed 40 characters",
                                },
                            })}
                            placeholder="Enter a Title for your project"
                            className="resize-none w-full rounded-none"
                        />
                        {errors.title && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Textarea
                            {...register("shortDescription", {
                                required: "Short summary is required",
                                minLength: {
                                    value: 10,
                                    message: "Short summary must be at least 10 characters",
                                },
                                maxLength: {
                                    value: 200,
                                    message: "Short summary cannot exceed 200 characters",
                                },
                            })}
                            placeholder="Enter a short summary of your project"
                            className="resize-none w-full"
                            rows={3}
                        />
                        {errors.shortDescription && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.shortDescription.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Textarea
                            {...register("description", {
                                required: "Description is required",
                                minLength: {
                                    value: 20,
                                    message: "Description must be at least 20 characters",
                                },
                                maxLength: {
                                    value: 500,
                                    message: "Description cannot exceed 500 characters",
                                },
                            })}
                            placeholder="Enter a description of your project"
                            className="resize-none w-full"
                            rows={6}
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                        )}
                    </div>

                    <Button type="submit" className="w-auto px-10 rounded-none mx-auto block">
                        Save
                    </Button>
                    {projectMetadata.title && (
                        <Button
                            onClick={() => updateEditorStage(2)}
                            variant="secondary"
                            className="w-auto px-10 rounded-none mx-auto block">Continue</Button>)}
                </form>
            </CardContent>
        </Card>
    );
};

export default ProjectDescInputs;
