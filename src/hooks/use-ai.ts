// useFetchProjects.ts

import { useMutation } from "@tanstack/react-query";
import { axiosApiInstance } from "../libs/axios-api-Instance";

// Define the fetch function
export const fetchLayoutDetails = async (layoutImageUrl: string) => {
  const { data } = await axiosApiInstance.post("/ai/layout", {layoutImageUrl});
  return data;
};

// Define the fetch function
export const processSpacesLayout = async (projectId: string) => {
  const { data } = await axiosApiInstance.post("/ai/layoutspaces", {projectId});
  return data;
};

export const useProcessSpacesLayout = () => {
  return useMutation({
    mutationFn: async (projectId: string) => {
      const { data } = await axiosApiInstance.post("/ai/layoutspaces", {projectId});
      return data;
    }
  });
};