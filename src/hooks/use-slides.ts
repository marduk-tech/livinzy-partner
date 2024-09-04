import { useMutation, useQuery } from "@tanstack/react-query";
import { Slide } from "../interfaces/Slide";
import { axiosApiInstance } from "../libs/axios-api-Instance";
import { queryKeys } from "../libs/react-query/constants";

/**
 * Custom hook to fetch slides by project using useQuery
 * @param {string} projectId - The ID of the project
 * @returns {UseQueryResult} The result of the useQuery hook
 */
export const useFetchSlidesByProject = (projectId: string) => {
  return useQuery({
    queryKey: [queryKeys.getSlides, projectId],
    queryFn: async () => {
      const { data } = await axiosApiInstance.get(
        `/slides/project/${projectId}`
      );
      return data;
    },
  });
};

/**
 * Custom hook to bulk save slides
 * @returns {UseMutationResult} The result of the useMutation hook
 */
export const useBulkSaveSlides = () => {
  return useMutation({
    mutationFn: async (slidesData: Slide[]) => {
      let response = await axiosApiInstance.post("/slides/bulk", slidesData);
      return response.data;
    },
  });
};

/**
 * Custom hook to save a single slide
 * @returns {UseMutationResult} The result of the useMutation hook
 */
export const useSaveSlide = () => {
  return useMutation({
    mutationFn: async (slideData: Partial<Slide>) => {
      let response;
      if (slideData._id) {
        response = await axiosApiInstance.put(
          `/slides/${slideData._id}`,
          slideData
        );
      } else {
        response = await axiosApiInstance.post("/slides", slideData);
      }
      return response.data;
    },
  });
};

/**
 * Custom hook to delete a slide
 * @returns {UseMutationResult} The result of the useMutation hook
 */
export const useDeleteSlide = () => {
  return useMutation({
    mutationFn: async (slideId: string) => {
      const response = await axiosApiInstance.delete(`/slides/${slideId}`);
      return response.data;
    },
  });
};
