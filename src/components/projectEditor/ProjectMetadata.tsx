"use client";
import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProjectMetadata } from "@/types/contexts";
import { useProjectContext } from "@/contexts/ProjectContext";

const ProjectDescInputs: React.FC = () => {
    const {
        uiState: { isDescOpen },
        updateProjectMetadata,
        projectMetadata,
        updateEditorStage,
    } = useProjectContext();

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<ProjectMetadata>();

    useEffect(() => {
        if (projectMetadata?.title) {
            reset({
                title: projectMetadata.title,
                shortDescription: projectMetadata.shortDescription,
                description: projectMetadata.description,
            });
        }
    }, [projectMetadata, reset]);

    const onSubmit: SubmitHandler<ProjectMetadata> = (data) => {
        updateProjectMetadata(data);
    };

    if (!isDescOpen) return null;

    return (
        <Card className="relative py-8 px-6 sm:px-10 md:px-16 lg:px-20 shadow-md rounded-none">
            <h2 className="text-center text-2xl font-semibold mb-6">
                Project Details
            </h2>
            <CardContent className="space-y-6">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                >
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
                            placeholder="Project Title"
                            className="w-full rounded-none"
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
                                    message: "Summary must be at least 10 characters",
                                },
                                maxLength: {
                                    value: 200,
                                    message: "Summary cannot exceed 200 characters",
                                },
                            })}
                            placeholder="Short Summary of Your Project"
                            className="w-full resize-none rounded-none"
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
                            placeholder="Detailed Project Description"
                            className="w-full resize-none"
                            rows={6}
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-center space-x-4 mt-6">
                        <Button
                            type="submit"
                            className="px-8 py-2 rounded-none"
                        >
                            Save
                        </Button>
                        {projectMetadata.title && (
                            <Button
                                onClick={() =>{
                                    updateEditorStage(2)
                                }}
                                variant="secondary"
                                className="px-8 py-2 rounded-none"
                            >
                                Continue
                            </Button>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default ProjectDescInputs;
