import { useMutation, useQuery } from "@tanstack/react-query";
import { FixtureFormData } from "../interfaces/Fixture";
import { axiosApiInstance } from "../libs/axios-api-Instance";
import { queryKeys } from "../libs/react-query/constants";

// Custom hook to fetch projects using useQuery
export const useFetchFixturesByProject = (projectId: string) => {
  return useQuery({
    queryKey: [queryKeys.getFixtures, projectId],
    queryFn: async () => {
      const { data } = await axiosApiInstance.get(
        `/fixtures/project/${projectId}`
      );
      return data;
    },
  });
};

// Custom hook to save designer data
export const useSaveFixture = () => {
  return useMutation({
    mutationFn: async (fixtureData: Partial<FixtureFormData>) => {
      let response;
      if (fixtureData._id) {
        response = await axiosApiInstance.put(
          `/fixtures/${fixtureData._id}`,
          fixtureData
        );
      } else {
        response = await axiosApiInstance.post("/fixtures", fixtureData);
      }
      return response.data;
    },
  });
};

// Custom hook to save designer data
export const useSearchFixtureHighlights = () => {
  return useMutation({
    mutationFn: async (searchData: any) => {
      let response = await axiosApiInstance.post(
        `/fixtures/highlights`,
        searchData
      );
      return response.data;
    },
  });
};

// Custom hook to save designer data
export const useDeleteFixture = () => {
  return useMutation({
    mutationFn: async (fixtureId: string) => {
      const response = await axiosApiInstance.delete(`/fixtures/${fixtureId}`);
      return response.data;
    },
  });
};
