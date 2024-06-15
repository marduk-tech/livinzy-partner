// useFetchProjects.ts

import { useQuery } from "@tanstack/react-query";
import { axiosApiInstance } from "../libs/axios-api-Instance";
import { queryKeys } from "../libs/react-query/constants";

// Custom hook to fetch projects using useQuery
export const useFetchProjects = () => {
  return useQuery({
    queryKey: [queryKeys.getProjects],
    queryFn: async () => {
      const { data } = await axiosApiInstance.get("/projects");
      return data;
    }
  });
};
