export const baseApiUrl = import.meta.env.VITE_API_URL;
export const baseAppUrl = import.meta.env.VITE_APP_URL;

export enum LAYOUT_AI_STATUS {
  UPLOADING = "Uploading",
  UPLOADED = "Uploaded",
  PROCESSING_SIZE = "Processing size",
  PROCESSING_SPACES = "Processing spaces",
  COMPLETED = "Completed",
  ERROR = "Error",
}
