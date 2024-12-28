import { MiniUser } from "./user";

export interface ITools {
  name: string;
  icon?: string;
}
export interface Imedia {
  type: "image" | "video";
  url: string;
}

export interface IStats {
  views: number;
  likes: number;
  comments: number;
}

export interface ICopyright {
  license: string;
  allowsDownload: boolean;
  commercialUse: boolean;
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
  status: "draft" | "published";
  category: string;
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
  tools: ITools[];
  category: string;
  stats: IStats;
  featured: boolean;
  publishedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
  status: "draft" | "published";
  projectUrl?: string;
  copyright: ICopyright;
}
