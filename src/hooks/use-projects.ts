// useFetchProjects.ts

import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosApiInstance } from "../libs/axios-api-Instance";
import { queryKeys } from "../libs/react-query/constants";
import { Project } from "../interfaces/Project";

// Custom hook to fetch projects using useQuery
export const useFetchProjects = () => {
  return useQuery({
    queryKey: [queryKeys.getProjects],
    queryFn: async () => {
      const { data } = await axiosApiInstance.get("/projects");
      return data;
    },
  });
};

// Custom hook to fetch projects using useQuery
export const useFetchProjectsByDesigner = (designerId: string) => {
  return useQuery({
    queryKey: [queryKeys.getProjects, designerId],
    queryFn: async () => {
      const { data } = await axiosApiInstance.get(`/projects/designer/${designerId}`);
      return data;
    },
  });
};

// Custom hook to save designer data
export const useSaveProject = () => {
  return useMutation({
    mutationFn: async (projectData: Project) => {
      let response;
      if (projectData._id) {
        response = await axiosApiInstance.put(`/projects/${projectData._id}`, projectData);

      } else {
        response = await axiosApiInstance.post("/projects", projectData);
      }
      return response.data;
    }
  });
};


// Custom hook to fetch project by id
export const useFetchProject = (id: string) => {
  return useQuery<Project, Error>({
    queryKey: [queryKeys.getProject, id],
    queryFn: async () => {
      const { data } = await axiosApiInstance.get(`/projects/${id}`);
      return data;
    }
  });
};
