import api from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const branchService = {
  getBranches: async () => {
    const response = await api.get("/branches");
    return response.data;
  },
  getBranch: async (id: string) => {
    const response = await api.get(`/branches/${id}`);
    return response.data;
  },
  createBranch: async (data: any) => {
    const response = await api.post("/branches", data);
    return response.data;
  },
  updateBranch: async ({ id, ...data }: any) => {
    const response = await api.put(`/branches/${id}`, data);
    return response.data;
  },
  deleteBranch: async (id: string) => {
    const response = await api.delete(`/branches/${id}`);
    return response.data;
  },
};

export const useBranchesQuery = () => {
  return useQuery({
    queryKey: ["Branches"],
    queryFn: () => branchService.getBranches(),
  });
};

export const useBranchQuery = (id: string) => {
  return useQuery({
    queryKey: ["Branch", id],
    queryFn: () => branchService.getBranch(id),
    enabled: !!id,
  });
};

export const useCreateBranchMutation = (options: any = {}) => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>({
    ...options,
    mutationFn: branchService.createBranch,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["Branches"] });
      if (options.onSuccess) options.onSuccess(...args);
    },
  });
};

export const useUpdateBranchMutation = (options: any = {}) => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>({
    ...options,
    mutationFn: branchService.updateBranch,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["Branches"] });
      if (options.onSuccess) options.onSuccess(...args);
    },
  });
};

export const useDeleteBranchMutation = (options: any = {}) => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>({
    ...options,
    mutationFn: branchService.deleteBranch,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["Branches"] });
      if (options.onSuccess) options.onSuccess(...args);
    },
  });
};
