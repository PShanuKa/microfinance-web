import api from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const userService = {
  getUsers: async (params: { page?: number; limit?: number; search?: string } = {}) => {
    const response = await api.get("/users", { params });
    return response.data;
  },
  createUser: async (data: any) => {
    const response = await api.post("/auth/register", data); // or /users if we move it
    return response.data;
  },
  updateUser: async ({ id, ...data }: any) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },
  resetPassword: async ({ id, password }: any) => {
    const response = await api.post(`/users/${id}/reset-password`, { password });
    return response.data;
  },
  updateStatus: async ({ id, status }: any) => {
    const response = await api.put(`/users/${id}/status`, { status });
    return response.data;
  },
};

export const useUsersQuery = (params: any = {}, options = {}) => {
  return useQuery({
    queryKey: ["Users", params],
    queryFn: () => userService.getUsers(params),
    ...options,
  });
};

export const useCreateUserMutation = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Users"] });
    },
    ...options,
  });
};

export const useUpdateUserMutation = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Users"] });
    },
    ...options,
  });
};

export const useResetPasswordMutation = (options = {}) => {
  return useMutation({
    mutationFn: userService.resetPassword,
    ...options,
  });
};

export const useUpdateUserStatusMutation = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.updateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Users"] });
    },
    ...options,
  });
};
