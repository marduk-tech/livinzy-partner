import { useMutation, useQuery } from "@tanstack/react-query";
import { cookieKeys, queryKeys } from "../libs/react-query/constants";
import { axiosApiInstance } from "../libs/axios-api-Instance";
import { Designer } from "../interfaces/Designer";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";

// Custom hook to fetch designer by id
export const useGetDesigner = (id: string) => {
  return useQuery<Designer, Error>({
    queryKey: [queryKeys.getDesigner],
    queryFn: async () => {
      const { data } = await axiosApiInstance.get(`/designers/${id}`);
      return data;
    },
  });
};

// Custom hook to fetch designer by email
export const useGetDesignerByEmail = (email: string) => {
  const [cookies, setCookie, removeCookie] = useCookies([cookieKeys.userId]);
  const [data, setData] = useState<Designer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosApiInstance.get(
          `/designers/email/${email}`
        );
        setCookie(cookieKeys.userId, response.data._id, { path: "/" });
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    if (email) {
      fetchData();
    }
  }, [email]);
  return { data, loading };
};

// Custom hook to save designer data
export const useSaveDesigner = () => {
  return useMutation({
    mutationFn: async (designerData: Designer) => {
      const response = await axiosApiInstance.post("/designers", designerData);
      return response.data;
    },
  });
};
