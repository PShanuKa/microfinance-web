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

export const useCreateBranchMutation = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: branchService.createBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Branches"] });
    },
    ...options,
  });
};

export const useUpdateBranchMutation = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: branchService.updateBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Branches"] });
    },
    ...options,
  });
};

export const useDeleteBranchMutation = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: branchService.deleteBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Branches"] });
    },
    ...options,
  });
};
