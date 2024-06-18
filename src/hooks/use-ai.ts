// useFetchProjects.ts

import { axiosApiInstance } from "../libs/axios-api-Instance";

// Define the fetch function
export const fetchLayoutDetails = async (layoutImageUrl: string) => {
  const { data } = await axiosApiInstance.post("/ai/layout", {layoutImageUrl});
  return data;
};