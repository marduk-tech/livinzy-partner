import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Designer } from "../interfaces/Designer";
import { axiosApiInstance } from "../libs/axios-api-Instance";
import { queryKeys } from "../libs/react-query/constants";

/**
 * Custom hook to fetch and manage user data
 * @returns {Object} Object containing user data, loading state, error state, and refetch function
 */
export function useUser() {
  const { user, isAuthenticated } = useAuth0();

  const [isQueryEnabled, setIsQueryEnabled] = useState(isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      setIsQueryEnabled(true);
    } else {
      setIsQueryEnabled(false);
    }
  }, [isAuthenticated]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [queryKeys.user],
    queryFn: async () => {
      return await axiosApiInstance.get(`/designers/email/${user?.email}`);
    },
    enabled: isQueryEnabled,
  });

  return {
    user: data?.data as Designer,
    isLoading,
    isError,
    error,
    refetch,
  };
}
