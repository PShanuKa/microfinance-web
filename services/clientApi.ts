import api from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const clientService = {
  getClients: async (params: { page?: number; limit?: number; search?: string; status?: string } = {}) => {
    const response = await api.get("/clients", { params });
    return response.data;
  },
  getClient: async (id: string) => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },
  createClient: async (data: any) => {
    const response = await api.post("/clients", data);
    return response.data;
  },
  updateClient: async ({ id, ...data }: any) => {
    const response = await api.put(`/clients/${id}`, data);
    return response.data;
  },
  deleteClient: async (id: string) => {
    const response = await api.delete(`/clients/${id}`);
    return response.data;
  },
};

export const useClientsQuery = (params: any = {}, options = {}) => {
  return useQuery({
    queryKey: ["Clients", params],
    queryFn: () => clientService.getClients(params),
    ...options,
  });
};

export const useClientQuery = (id: string, options = {}) => {
  return useQuery({
    queryKey: ["Client", id],
    queryFn: () => clientService.getClient(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreateClientMutation = (options: any = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clientService.createClient,
    ...options,
    onSuccess: (...args: any[]) => {
      queryClient.invalidateQueries({ queryKey: ["Clients"] });
      if (options.onSuccess) options.onSuccess(...args);
    },
  });
};

export const useUpdateClientMutation = (options: any = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clientService.updateClient,
    ...options,
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: ["Client", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["Clients"] });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};

export const useDeleteClientMutation = (options: any = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clientService.deleteClient,
    ...options,
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: ["Client", variables] });
      queryClient.invalidateQueries({ queryKey: ["Clients"] });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
  });
};
