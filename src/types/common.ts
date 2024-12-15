import { ProjectMini } from "./project";
import { MiniUser } from "./user";

export interface PaginationMetadata {
  total: number;
  page: number;
  pages: number;
  limit?: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface UserSearchResponse {
  message: string;
  pagination: PaginationMetadata;
  data: MiniUser[];
}

export interface ProjectSearchResponse {
  message: string;
  pagination: PaginationMetadata;
  data: ProjectMini[];
}


export interface SearchParams {
  query?: string;
  tag?: string;
  type?: "project" | "user";
  page: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  category?: string;
  filter?: string;
}