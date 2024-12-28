import { MiniProject } from "./project";

export interface User {
  _id: string;
  expiresIn: number;
  email: string;
  fullName: string;
  profile?: Profile;
}

export interface Profile {
  availableForHire?: boolean;
  bio?: string;
  avatar?: string;
  cover?: string;
  website?: string;
  profession?: string;
  social?: Social;
}
export interface Social {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
}

// MiniUser interface
export interface MiniUser {
  _id: string;
  fullName: string;
  avatar?: string;
  profession?: string;
  followersCount?: number;
  projects?: string[];
  availableForHire?: boolean;
}
