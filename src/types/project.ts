import { Itool } from "./others";
import { MiniUser } from "./user";

export interface IStats {
  views: number;
  likes: number;
  comments: number;
}
export enum License {
  CC_BY_4_0 = "CC BY 4.0",
  MIT_License = "MIT License",
  All_Rights_Reserved = "All Rights Reserved",
}

export interface ICopyright {
  license: License;
  allowsDownload: boolean;
  commercialUse: boolean;
}

export enum ProjectStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
}
// Main Project Type
export interface ProjectType {
  _id?: string;
  title: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  media: Imedia[];
  creator: MiniUser;
  collaborators?: MiniUser[];
  tags: string[];
  tools: Itool[];
  category: string;
  stats: IStats;
  featured: boolean;
  publishedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
  status: ProjectStatus;
  projectUrl?: string;
  copyright: ICopyright;
}

export interface ProjectUploadType {
  _id?: string;
  title: string;
  description: string;
  shortDescription: string;
  thumbnail: Thumbnail | string;
  media: Imedia[];
  creator: string; // User ID
  collaborators?: string[]; // Array of user IDs
  tags: string[];
  tools: Itool[];
  category: string;
  stats: IStats;
  featured: boolean;
  publishedAt: number;
  createdAt?: Date;
  updatedAt?: Date;
  status: ProjectStatus;
  projectUrl?: string;
  copyright: ICopyright;
}

export interface Imedia {
  type: "image" | "video";
  url: string;
}

export interface TempMedia extends Imedia {
  file?: File;
}
export interface Thumbnail {
  url: string;
  file?: File;
  type: "image/thumbnail";
}

export interface MiniProject {
  _id?: string;
  title: string;
  thumbnail: string;
  creator?: MiniUser;
  collaborators?: MiniUser[];
  stats: IStats;
  featured: boolean;
  publishedAt: Date;
  status: ProjectStatus;
  category: string;
}
