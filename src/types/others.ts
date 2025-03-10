import {MiniProject} from "./project";
import {MiniUser} from "@/types/user";

export interface IComment {
    _id?: string;
    content: string;
    projectId: string; // Reference to the project
    author: {
        userId: string; // Reference to the user
        fullName: string;
        avatar?: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Itool {
    _id: string;
    name: string;
    icon: string;
}

export interface ILike {
    _id?: string;
    likedBy: {
        userId: string;
        fullName: string;
        avatar?: string;
    };
    projectId: string;
    createdAt: Date;
}

export interface IBookmark {
    _id?: string;
    userId: string;
    project: MiniProject;
    createdAt: Date;
}

export interface IFollow {
    _id?: string;
    follower: string;
    following: string;
    createdAt: Date;
}

export interface Conversation {
    user: MiniUser;
    lastMessageAt: Date;
}

export interface Message {
    text: string;
    sender?: string;
    recipient?: string;
    conversationId: string;
    _id?: string;
}
