export interface LoginPayload {
  googleToken?: string;
  email?: string;
  password?: string;
}
export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
}
