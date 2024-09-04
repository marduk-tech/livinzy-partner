// useFetchProjects.ts

import { useMutation, useQuery } from "@tanstack/react-query";
import { Project } from "../interfaces/Project";
import { axiosApiInstance } from "../libs/axios-api-Instance";
import { queryKeys } from "../libs/react-query/constants";

/**
 * Custom hook to fetch projects using useQuery
 * @returns {UseQueryResult} The result of the useQuery hook
 */
export const useFetchProjects = () => {
  return useQuery({
    queryKey: [queryKeys.getProjects],
    queryFn: async () => {
      const { data } = await axiosApiInstance.get("/projects");
      return data;
    },
  });
};

/**
 * Custom hook to fetch projects by designer using useQuery
 * @param {string} designerId - The ID of the designer
 * @returns {UseQueryResult} The result of the useQuery hook
 */
export const useFetchProjectsByDesigner = (designerId: string) => {
  return useQuery({
    queryKey: [queryKeys.getProjects, designerId],
    queryFn: async () => {
      const { data } = await axiosApiInstance.get(
        `/projects/designer/${designerId}`
      );
      return data;
    },
  });
};

/**
 * Custom hook to save project data
 * @returns {UseMutationResult} The result of the useMutation hook
 */
export const useSaveProject = () => {
  return useMutation({
    mutationFn: async (projectData: Partial<Project>) => {
      let response;
      if (projectData._id) {
        response = await axiosApiInstance.put(
          `/projects/${projectData._id}`,
          projectData
        );
      } else {
        response = await axiosApiInstance.post("/projects", projectData);
      }
      return response.data;
    },
  });
};

/**
 * Custom hook to fetch project by id
 * @param {string} id - The ID of the project
 * @returns {UseQueryResult<Project, Error>} The result of the useQuery hook
 */
export const useFetchProject = (id: string) => {
  return useQuery<Project, Error>({
    queryKey: [queryKeys.getProject, id],
    queryFn: async () => {
      const { data } = await axiosApiInstance.get(`/projects/${id}`);
      return data;
    },
  });
};

/**
 * Custom hook to delete a project
 * @returns {UseMutationResult} The result of the useMutation hook
 */
export const useDeleteProject = () => {
  return useMutation({
    mutationFn: async ({ projectId }: { projectId: string }) => {
      const response = await axiosApiInstance.delete(`/projects/${projectId}`);
      return response.data;
    },
  });
};
