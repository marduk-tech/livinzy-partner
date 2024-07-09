// useFetchProjects.ts

import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosApiInstance } from "../libs/axios-api-Instance";
import { queryKeys } from "../libs/react-query/constants";
import { FixtureMeta } from "../interfaces/Meta";

// Custom hook to fetch projects using useQuery
export const getHomeMeta = () => {
  return useQuery({
    queryKey: [queryKeys.getHomeMeta],
    queryFn: async () => {
      const { data } = await axiosApiInstance.get("/homemeta");
      return data;
    },
  });
};

// Custom hook to fetch projects using useQuery
export const getSpaceMeta = () => {
  return useQuery({
    queryKey: [queryKeys.getSpaceMeta],
    queryFn: async () => {
      const { data } = await axiosApiInstance.get("/spacemeta");
      return data;
    },
  });
};

// Custom hook to fetch projects using useQuery
export const getFixtureMeta = () => {
  return useQuery({
    queryKey: [queryKeys.getFixtureMeta],
    queryFn: async () => {
      const { data } = await axiosApiInstance.get("/fixturemeta");
      return data;
    },
  });
};

// Custom hook to fetch projects using useQuery
export const getFixtureMaterialVariationsMetaByMaterial = (
  materialId: string
) => {
  return useQuery({
    queryKey: [queryKeys.getMaterialVariatonByMaterial, materialId],
    queryFn: async () => {
      const { data } = await axiosApiInstance.get(
        `/materialvariationmeta/material/${materialId}`
      );
      return data;
    },
  });
};

// Custom hook to fetch projects using useQuery
export const getFixtureMaterialFinishesMetaByMaterial = (
  materialId: string
) => {
  return useQuery({
    queryKey: [queryKeys.getMaterialFinishByMaterial, materialId],
    queryFn: async () => {
      const { data } = await axiosApiInstance.get(
        `/materialfinishmeta/material/${materialId}`
      );
      return data;
    },
  });
};

// Custom hook to save designer data
export const useSaveFixtureMeta = () => {
  return useMutation({
    mutationFn: async (fixtureMeta: FixtureMeta) => {
      let response;
      response = await axiosApiInstance.post("/fixturemeta", fixtureMeta);
      return response.data;
    },
  });
};
