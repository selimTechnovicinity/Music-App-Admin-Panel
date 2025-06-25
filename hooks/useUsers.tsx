import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "@/lib/api"; // adjust the path
import { useMemo } from "react";

export const useUsers = (
  role: string,
  pageNo: number,
  limit: number,
  searchQuery: string
) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["users", role, pageNo, limit, searchQuery],
    queryFn: () => getAllUsers(role, pageNo, limit, searchQuery),
    // keepPreviousData: true,
  });

  const users = useMemo(() => data?.data ?? [], [data]);
  const totalPages = useMemo(() => data?.pagination?.totalPages ?? 0, [data]);
  const message = isError ? "No users found. Please add a user." : null;

  return {
    users,
    totalPages,
    isPending,
    error: message,
  };
};
