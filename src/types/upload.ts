export interface GeneratedUploadURL {
  uploadUrl: string;
  id?: number;
  key: string;
}
export type CloudinaryUploadResponse = {
  public_id: string;
  secure_url: string;
  resource_type: "image" | "video" | "image/thumbnail";
  bytes: number;
};
export interface UploadSuccessResponse {
  ok: boolean;
  status: number;
  url: string;
}
