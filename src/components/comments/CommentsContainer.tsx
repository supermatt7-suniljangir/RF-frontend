
import { ProjectType } from "@/types/project";
import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import PostComment from "./PostComment";
import CommentsList from "./CommentsList";
import { fetchComments } from "@/services/serverServices/comments/getAllCommentsById";

interface CommentsContainerProps {
  project: ProjectType;
}

const CommentsContainer: React.FC<CommentsContainerProps> = async ({ project }) => {
  const response = await fetchComments(project._id);

  if (!response?.success) {
    return (
      <p className="text-muted-foreground text-center my-4">
        {response?.message || "Failed to load comments"}
      </p>
    );
  }

  return (
    <Card className="sm:w-5/6 w-[95%] mt-8 rounded-none">
      <CardHeader className="text-center">Remarks</CardHeader>
      <CardContent>
        <PostComment projectId={project._id} />
        <CommentsList comments={response.data || []} />
      </CardContent>
    </Card>
  );
};

export default CommentsContainer;
