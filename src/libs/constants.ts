export const baseApiUrl = import.meta.env.VITE_API_URL;
export const baseAppUrl = import.meta.env.VITE_APP_URL;

export const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN;
export const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
export const auth0CallbackUrl = import.meta.env.VITE_AUTH0_CALLBACK_URL;

export enum LAYOUT_AI_STATUS {
  UPLOADING = "Uploading",
  UPLOADED = "Uploaded",
  PROCESSING_SIZE = "Processing size",
  PROCESSING_SPACES = "Processing spaces",
  COMPLETED = "Completed",
  ERROR = "Error",
}

export const WorkTypes = [
  { value: "wood", label: "Wood" },
  { value: "stone", label: "Stone" },
  { value: "lighting", label: "lighting" },
  { value: "hardware", label: "Hardware" },
];
