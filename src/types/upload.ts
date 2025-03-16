export interface UploadFileResponse {
  uploadUrl: string;
  key: string;
}
export interface UploadSuccessResponse {
  ok: boolean;
  status: number;
  url: string;
}
