import api from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// API Functions
const authService = {
  login: async (data: any) => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },
  register: async (data: any) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get("/users/me");
    return response.data;
  },
  forgotPassword: async (data: any) => {
    const response = await api.post("/auth/forgot-password", data);
    return response.data;
  },
  resetPassword: async (data: any) => {
    const response = await api.post("/auth/reset-password", data);
    return response.data;
  },
};

// Custom Hooks (Mimicking RTK Query style)
export const useLoginMutation = (options = {}) => {
  return useMutation({
    mutationFn: authService.login,
    ...options,
  });
};

export const useRegisterMutation = (options = {}) => {
  return useMutation({
    mutationFn: authService.register,
    ...options,
  });
};

export const useGetMeQuery = (options = {}) => {
  return useQuery({
    queryKey: ["Auth", "me"],
    queryFn: authService.getMe,
    ...options,
  });
};

export const useForgotPasswordMutation = (options = {}) => {
  return useMutation({
    mutationFn: authService.forgotPassword,
    ...options,
  });
};

export const useResetPasswordMutation = (options = {}) => {
  return useMutation({
    mutationFn: authService.resetPassword,
    ...options,
  });
};
