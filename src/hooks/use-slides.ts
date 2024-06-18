import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosApiInstance } from "../libs/axios-api-Instance";
import { queryKeys } from "../libs/react-query/constants";
import { Slide } from "../interfaces/Slide";

// Custom hook to fetch projects using useQuery
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

// Custom hook to save designer data
export const useBulkSaveSlides = () => {
    return useMutation({
      mutationFn: async (slidesData: Slide[]) => {
        let response = await axiosApiInstance.post("/slides/bulk", slidesData);
        return response.data;
      },
    });
  };

// Custom hook to save designer data
export const useSaveSlide = () => {
  return useMutation({
    mutationFn: async (slideData: Slide) => {
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

// Custom hook to save designer data
export const useDeleteSlide = () => {
  return useMutation({
    mutationFn: async (slideId: string) => {
      const response = await axiosApiInstance.delete(`/slides/${slideId}`);
      return response.data;
    },
  });
};
