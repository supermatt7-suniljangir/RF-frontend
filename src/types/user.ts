export interface User {
  _id: number;
  expiresIn: number;
  username?: string;
  email: string;
  fullName: string;
  profile?: Profile;
}

export interface Profile {
  bio?: string;
  avatar?: string;
  cover?: string;
  followers?: number[];
  following?: number[];
  website?: string;
  phone?: string;
  social?: Social;
}
export interface Social {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
}
