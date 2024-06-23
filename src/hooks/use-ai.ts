// useFetchProjects.ts

import { useMutation } from "@tanstack/react-query";
import { axiosApiInstance } from "../libs/axios-api-Instance";

// Define the fetch function
export const fetchLayoutDetails = async (
  layoutImageUrl: string,
  refresh: boolean
) => {
  const { data } = await axiosApiInstance.post("/ai/layout", {
    layoutImageUrl,
    refresh,
  });
  return data;
};

// Define the fetch function
export const processSpacesLayout = async (projectId: string) => {
  const { data } = await axiosApiInstance.post("/ai/layoutspaces", {
    projectId,
  });
  return data;
};

export const useProcessSpacesLayout = () => {
  return useMutation({
    mutationFn: async (projectId: string) => {
      const { data } = await axiosApiInstance.post("/ai/layoutspaces", {
        projectId,
      });
      return data;
    },
  });
};

export const useProcessSpacesInSlides = () => {
  return useMutation({
    mutationFn: async (slideData: any) => {
      const { data } = await axiosApiInstance.post("/ai/slidespaces", {
        projectId: slideData.projectId,
        slideId: slideData.slideId,
      });
      return data;
    },
  });
};
