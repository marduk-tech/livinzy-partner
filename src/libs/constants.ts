export const baseApiUrl = import.meta.env.VITE_API_URL;
export const baseAppUrl = import.meta.env.VITE_APP_URL;

export enum IMG_AI_STATUS {
  UPLOADING = "Uploading",
  UPLOADED = "Uploaded",
  PROCESSING = "Processing",
  COMPLETED = "Completed",
  ERROR = "Error",
}
