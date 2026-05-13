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

export const useCreateClientMutation = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clientService.createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Clients"] });
    },
    ...options,
  });
};

export const useUpdateClientMutation = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clientService.updateClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Clients"] });
    },
    ...options,
  });
};
