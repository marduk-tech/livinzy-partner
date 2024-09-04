import { useMutation, useQuery } from "@tanstack/react-query";
import { Space, SpaceUpdateBody } from "../interfaces/Space";
import { axiosApiInstance } from "../libs/axios-api-Instance";
import { queryKeys } from "../libs/react-query/constants";

/**
 * Custom hook to fetch spaces by project using useQuery
 * @param {string} projectId - The ID of the project
 * @returns {UseQueryResult} The result of the useQuery hook
 */
export const useFetchSpacesByProject = (projectId: string) => {
  return useQuery({
    queryKey: [queryKeys.getSpaces, projectId],
    queryFn: async () => {
      const { data } = await axiosApiInstance.get(
        `/spaces/project/${projectId}`
      );
      return data;
    },
  });
};

/**
 * Custom hook to save space data
 * @returns {UseMutationResult} The result of the useMutation hook
 */
export const useSaveSpace = () => {
  return useMutation({
    mutationFn: async (spaceData: Partial<SpaceUpdateBody | Space>) => {
      let response;
      if (spaceData._id) {
        response = await axiosApiInstance.put(
          `/spaces/${spaceData._id}`,
          spaceData
        );
      } else {
        response = await axiosApiInstance.post("/spaces", spaceData);
      }
      return response.data;
    },
  });
};

/**
 * Custom hook to delete a space
 * @returns {UseMutationResult} The result of the useMutation hook
 */
export const useDeleteSpace = () => {
  return useMutation({
    mutationFn: async (spaceId: string) => {
      const response = await axiosApiInstance.delete(`/spaces/${spaceId}`);
      return response.data;
    },
  });
};
