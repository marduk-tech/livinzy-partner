import { useMutation, useQuery } from "@tanstack/react-query";
import { Designer } from "../interfaces/Designer";
import { axiosApiInstance } from "../libs/axios-api-Instance";
import { queryKeys } from "../libs/react-query/constants";

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
// export const useGetDesignerByEmail = (email: string) => {
//   const [cookies, setCookie, removeCookie] = useCookies([cookieKeys.userId]);
//   const [data, setData] = useState<Designer | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         const response = await axiosApiInstance.get(
//           `/designers/email/${email}`
//         );
//         setCookie(cookieKeys.userId, response.data._id, { path: "/" });
//         setData(response.data);
//         setIsLoading(false);
//       } catch (err) {
//         setIsLoading(false);
//       }
//     };

//     if (email) {
//       fetchData();
//     }
//   }, [email]);
//   return { data, isLoading };
// };

// Custom hook to save designer data
export const useSaveDesigner = () => {
  return useMutation({
    mutationFn: async (designerData: Designer) => {
      const response = await axiosApiInstance.post("/designers", designerData);
      return response.data;
    },
  });
};
