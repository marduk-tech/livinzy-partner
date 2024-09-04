// useFetchProjects.ts

import { useMutation } from "@tanstack/react-query";

import { axiosApiInstance } from "../libs/axios-api-Instance";

/**
 * Fetches layout details from the server
 * @param {string} layoutImageUrl - The URL of the layout image
 * @param {boolean} refresh - Whether to refresh the data
 * @returns {Promise<any>} The layout details data
 */
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

/**
 * Processes spaces layout for a project
 * @param {string} projectId - The ID of the project
 * @returns {Promise<any>} The processed spaces layout data
 */
export const processSpacesLayout = async (projectId: string) => {
  const { data } = await axiosApiInstance.post("/ai/layoutspaces", {
    projectId,
  });
  return data;
};

/**
 * Custom hook to process spaces layout
 * @returns {UseMutationResult} The result of the useMutation hook
 */
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

/**
 * Custom hook to map spaces to slides
 * @returns {UseMutationResult} The result of the useMutation hook
 */
export const useMapSpacesToSlides = () => {
  return useMutation({
    mutationFn: async (slideData: any) => {
      const { data } = await axiosApiInstance.post("/ai/spacesslides", {
        projectId: slideData.projectId,
      });
      return data;
    },
  });
};

/**
 * Custom hook to describe a project
 * @returns {UseMutationResult} The result of the useMutation hook
 */
export const useDescribeProject = () => {
  return useMutation({
    mutationFn: async (projectId: string) => {
      const { data } = await axiosApiInstance.post("/ai/projectdescribe", {
        projectId,
      });
      return data;
    },
  });
};

/**
 * Custom hook to generate a one-liner description
 * @returns {UseMutationResult} The result of the useMutation hook
 */
export const useGenerateOneLiner = () => {
  return useMutation({
    mutationFn: async ({
      projectId,
      fixtureId,
      spaceId,
      designName,
      slideId,
    }: {
      projectId: string;
      designName: string;
      fixtureId?: string;
      spaceId?: string;
      slideId?: string;
    }) => {
      const { data } = await axiosApiInstance.post("/ai/projectoneliner", {
        projectId: projectId,
        fixtureId: fixtureId,
        spaceId: spaceId,
        designName: designName,
        slideId: slideId,
      });
      return data;
    },
  });
};
